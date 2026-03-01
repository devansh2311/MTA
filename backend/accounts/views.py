from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, OwnerProfile
from .serializers import (
    UserSerializer, CustomerRegisterSerializer, OwnerRegisterSerializer,
    OwnerProfileSerializer, LoginSerializer
)


class CustomerRegisterView(generics.CreateAPIView):
    """Register a new customer account."""
    serializer_class = CustomerRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Customer registered successfully.',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class OwnerRegisterView(generics.CreateAPIView):
    """Register a new owner account with shop details."""
    serializer_class = OwnerRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Owner registered successfully.',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Login for both customers and owners."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        response_data = {
            'message': 'Login successful.',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }

        # Include owner profile if user is an owner
        if user.role == 'owner' and hasattr(user, 'owner_profile'):
            response_data['owner_profile'] = OwnerProfileSerializer(user.owner_profile).data

        return Response(response_data)


class ProfileView(generics.RetrieveUpdateAPIView):
    """Get and update the current user's profile."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class OwnerProfileView(generics.RetrieveUpdateAPIView):
    """Get and update owner profile (shop details)."""
    serializer_class = OwnerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return OwnerProfile.objects.get(user=self.request.user)
