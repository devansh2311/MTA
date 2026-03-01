from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_order_confirmation_email(order):
    """
    Sends an order confirmation email to the user when an order is successfully placed and paid.
    """
    if not order.user.email:
        return # Skip if user has no email

    subject = f'Order Confirmation - {order.order_number}'
    
    # We'll use a plain text email for simplicity, but could be upgraded to HTML
    message = (
        f"Hi {order.user.first_name or 'Customer'},\n\n"
        f"Thank you for shopping with Handloom Heritage!\n"
        f"We have received your order {order.order_number} and it is now confirmed.\n\n"
        f"Total Amount: ₹{order.total_amount}\n"
        f"Delivery Address:\n{order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}\n\n"
        f"We will notify you once your order is shipped.\n\n"
        f"Best regards,\n"
        f"The Handloom Heritage Team"
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [order.user.email],
        fail_silently=True,
    )

def send_order_status_update_email(order):
    """
    Sends an email to the user when the order status changes (e.g., to 'shipped' or 'delivered').
    """
    if not order.user.email:
        return

    status_messages = {
        'processing': "Your order is now being processed. We are getting it ready for shipment!",
        'shipped': "Great news! Your order has been shipped and is on its way to you.",
        'delivered': "Your order has been delivered! We hope you love your purchase.",
        'cancelled': "Your order has been cancelled. If you have any questions, please contact support."
    }

    # Don't send emails for 'pending' or 'confirmed' as confirming is handled by the initial email
    if order.status not in status_messages:
        return

    subject = f'Order Status Update - {order.order_number}'
    
    message = (
        f"Hi {order.user.first_name or 'Customer'},\n\n"
        f"There is an update on your order {order.order_number}.\n\n"
        f"{status_messages[order.status]}\n\n"
        f"Track your order details in your dashboard anytime.\n\n"
        f"Best regards,\n"
        f"The Handloom Heritage Team"
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [order.user.email],
        fail_silently=True,
    )
