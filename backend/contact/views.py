from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactMessageCreateView(generics.CreateAPIView):
    """Submit a contact form message."""
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'message': 'Thank you for contacting us! We will get back to you soon.'
        }, status=status.HTTP_201_CREATED)

class OwnerContactMessageListView(generics.ListAPIView):
    """List contact messages for owners."""
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Currently, all owners can see all messages. 
        # In a multi-tenant system you'd filter this by the shop the message was intended for.
        return ContactMessage.objects.all().order_by('-created_at')
