from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_price', 'quantity', 'subtotal']
        read_only_fields = ['id']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'total_amount', 'shipping_name', 'shipping_email',
                  'shipping_phone', 'shipping_address', 'shipping_city', 'shipping_state',
                  'shipping_pincode', 'status', 'payment_status', 'razorpay_order_id',
                  'items', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'order_number', 'razorpay_order_id', 'created_at', 'updated_at']


class OrderItemInputSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class CreateOrderSerializer(serializers.Serializer):
    shipping_name = serializers.CharField(max_length=200)
    shipping_email = serializers.EmailField()
    shipping_phone = serializers.CharField(max_length=15)
    shipping_address = serializers.CharField()
    shipping_city = serializers.CharField(max_length=100)
    shipping_state = serializers.CharField(max_length=100)
    shipping_pincode = serializers.CharField(max_length=10)
    notes = serializers.CharField(required=False, allow_blank=True)
    items = OrderItemInputSerializer(many=True, required=False)


class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()


class UpdateOrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
