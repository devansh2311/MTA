import razorpay
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, OrderItem
from cart.models import Cart
from .serializers import (
    OrderSerializer, CreateOrderSerializer, VerifyPaymentSerializer,
    UpdateOrderStatusSerializer
)
from .emails import send_order_confirmation_email, send_order_status_update_email


class CreateOrderView(APIView):
    """Create an order from the user's cart and initiate Razorpay payment."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        custom_items_data = serializer.validated_data.pop('items', None)
        items_to_process = []
        total = 0
        from products.models import Product

        if custom_items_data:
            # Bypass cart, use passed items
            for item_data in custom_items_data:
                try:
                    product = Product.objects.get(id=item_data['product'])
                    if product.stock < item_data['quantity']:
                        return Response({'error': f'Not enough stock for {product.name}'}, status=status.HTTP_400_BAD_REQUEST)
                    items_to_process.append({
                        'product': product,
                        'name': product.name,
                        'price': product.effective_price,
                        'quantity': item_data['quantity']
                    })
                    total += product.effective_price * item_data['quantity']
                except Product.DoesNotExist:
                    return Response({'error': f'Product ID {item_data["product"]} not found.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Use user's cart
            try:
                cart = Cart.objects.get(user=request.user)
            except Cart.DoesNotExist:
                return Response({'error': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

            cart_items = cart.items.all()
            if not cart_items.exists():
                return Response({'error': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

            for cart_item in cart_items:
                if cart_item.product.stock < cart_item.quantity:
                    return Response({'error': f'Not enough stock for {cart_item.product.name}'}, status=status.HTTP_400_BAD_REQUEST)
                items_to_process.append({
                    'product': cart_item.product,
                    'name': cart_item.product.name,
                    'price': cart_item.product.effective_price,
                    'quantity': cart_item.quantity
                })
                total += cart_item.subtotal
                
        # Calculate shipping logic (e.g. strict > 2999 = free)
        shipping_cost = 0 if total > 2999 else 149
        final_total = total + shipping_cost

        # Create order
        order = Order.objects.create(
            user=request.user,
            total_amount=final_total,
            **serializer.validated_data
        )

        # Create order items and reduce stock
        for item in items_to_process:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                product_name=item['name'],
                product_price=item['price'],
                quantity=item['quantity']
            )
            # Reduce stock
            item['product'].stock -= item['quantity']
            item['product'].save()

        # Create Razorpay order
        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            razorpay_order = client.order.create({
                'amount': int(final_total * 100),  # Amount in paise
                'currency': 'INR',
                'receipt': order.order_number,
            })
            order.razorpay_order_id = razorpay_order['id']
            order.save()
        except Exception:
            order.razorpay_order_id = f"mock_{order.order_number}"
            order.save()

        # Clear cart if we used cart items
        if not custom_items_data and 'cart_items' in locals():
            cart_items.delete()

        # Send confirmation email immediately since frontend doesn't hit VerifyPaymentView yet
        send_order_confirmation_email(order)

        return Response({
            'order': OrderSerializer(order).data,
            'razorpay_order_id': order.razorpay_order_id,
            'razorpay_key_id': settings.RAZORPAY_KEY_ID,
            'amount': int(total * 100),
        }, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    """Verify Razorpay payment signature."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            order = Order.objects.get(
                razorpay_order_id=serializer.validated_data['razorpay_order_id'],
                user=request.user
            )
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            client.utility.verify_payment_signature({
                'razorpay_order_id': serializer.validated_data['razorpay_order_id'],
                'razorpay_payment_id': serializer.validated_data['razorpay_payment_id'],
                'razorpay_signature': serializer.validated_data['razorpay_signature'],
            })
            order.payment_status = 'completed'
            order.status = 'confirmed'
            order.razorpay_payment_id = serializer.validated_data['razorpay_payment_id']
            order.razorpay_signature = serializer.validated_data['razorpay_signature']
            order.save()
            
            # Send confirmation email
            send_order_confirmation_email(order)
            
            return Response({'message': 'Payment verified successfully.', 'order': OrderSerializer(order).data})
        except Exception:
            order.payment_status = 'failed'
            order.save()
            return Response({'error': 'Payment verification failed.'}, status=status.HTTP_400_BAD_REQUEST)


class UserOrderListView(generics.ListAPIView):
    """List orders for the current user."""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    """Get order detail."""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OwnerOrderListView(generics.ListAPIView):
    """List orders containing the owner's products."""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            items__product__owner=self.request.user
        ).distinct()


class UpdateOrderStatusView(APIView):
    """Update order status (owner only)."""
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        serializer = UpdateOrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order = Order.objects.filter(
            id=pk,
            items__product__owner=request.user
        ).distinct().first()

        if not order:
            return Response({'error': 'Order not found or no permission.'}, status=status.HTTP_404_NOT_FOUND)

        order.status = serializer.validated_data['status']
        order.save()
        
        # Send status update email if applicable
        send_order_status_update_email(order)
        
        return Response(OrderSerializer(order).data)


class OwnerStatsView(APIView):
    """Return summary stats for the owner dashboard."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from products.models import Product
        from django.db.models import Sum, Count

        owner_orders = Order.objects.filter(items__product__owner=request.user).distinct()
        total_revenue = owner_orders.aggregate(total=Sum('total_amount'))['total'] or 0
        total_orders = owner_orders.count()
        total_products = Product.objects.filter(owner=request.user).count()
        # Unique customers
        total_customers = owner_orders.values('user').distinct().count()

        # Revenue by status
        delivered_revenue = owner_orders.filter(status='delivered').aggregate(total=Sum('total_amount'))['total'] or 0
        pending_orders = owner_orders.filter(status__in=['pending', 'confirmed', 'processing']).count()
        shipped_orders = owner_orders.filter(status='shipped').count()

        # Recent 5 orders
        recent_orders = OrderSerializer(owner_orders.order_by('-created_at')[:5], many=True).data

        return Response({
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'total_products': total_products,
            'total_customers': total_customers,
            'delivered_revenue': delivered_revenue,
            'pending_orders': pending_orders,
            'shipped_orders': shipped_orders,
            'recent_orders': recent_orders,
        })


class OwnerCustomerListView(APIView):
    """List customers who have placed orders with this owner."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from django.db.models import Sum, Count

        # Get all orders for this owner's products
        owner_orders = Order.objects.filter(items__product__owner=request.user).distinct()

        # Group by user
        customer_stats = (
            owner_orders
            .values('user__id', 'user__first_name', 'user__last_name', 'user__email', 'user__phone')
            .annotate(order_count=Count('id', distinct=True), total_spend=Sum('total_amount'))
            .order_by('-total_spend')
        )

        customers = []
        for c in customer_stats:
            # Get latest order status for this customer
            latest_order = owner_orders.filter(user_id=c['user__id']).order_by('-created_at').first()
            customers.append({
                'id': c['user__id'],
                'name': f"{c['user__first_name']} {c['user__last_name']}".strip() or 'N/A',
                'email': c['user__email'],
                'phone': c['user__phone'] or '—',
                'order_count': c['order_count'],
                'total_spend': float(c['total_spend'] or 0),
                'last_order_status': latest_order.status if latest_order else '—',
                'last_order_date': latest_order.created_at.strftime('%d %b %Y') if latest_order else '—',
            })

        return Response(customers)

