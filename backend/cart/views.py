from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem, Wishlist
from products.models import Product
from .serializers import (
    CartSerializer, CartItemSerializer, AddToCartSerializer,
    UpdateCartItemSerializer, WishlistSerializer
)


class CartView(generics.RetrieveAPIView):
    """Get the current user's cart."""
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart


class AddToCartView(APIView):
    """Add a product to the cart."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        if quantity > product.stock:
            return Response({'error': 'Not enough stock available.'}, status=status.HTTP_400_BAD_REQUEST)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        return Response(CartSerializer(cart, context={'request': request}).data)


class UpdateCartItemView(APIView):
    """Update cart item quantity."""
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            cart_item = CartItem.objects.get(id=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found.'}, status=status.HTTP_404_NOT_FOUND)

        cart_item.quantity = serializer.validated_data['quantity']
        cart_item.save()

        cart = cart_item.cart
        return Response(CartSerializer(cart, context={'request': request}).data)


class RemoveCartItemView(APIView):
    """Remove an item from the cart."""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            cart_item = CartItem.objects.get(id=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found.'}, status=status.HTTP_404_NOT_FOUND)

        cart = cart_item.cart
        cart_item.delete()
        return Response(CartSerializer(cart, context={'request': request}).data)


class ClearCartView(APIView):
    """Clear all items from the cart."""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response(CartSerializer(cart, context={'request': request}).data)


class WishlistView(generics.ListAPIView):
    """List user's wishlist."""
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related('product')


class AddToWishlistView(APIView):
    """Add a product to wishlist."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
        if not created:
            return Response({'message': 'Already in wishlist.'})
        return Response({'message': 'Added to wishlist.'}, status=status.HTTP_201_CREATED)


class RemoveFromWishlistView(APIView):
    """Remove a product from wishlist."""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            item = Wishlist.objects.get(id=pk, user=request.user)
        except Wishlist.DoesNotExist:
            return Response({'error': 'Wishlist item not found.'}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        return Response({'message': 'Removed from wishlist.'})
