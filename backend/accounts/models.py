from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model with role-based access."""
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('owner', 'Owner'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class OwnerProfile(models.Model):
    """Extended profile for shop owners."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='owner_profile')
    shop_name = models.CharField(max_length=200)
    shop_description = models.TextField(blank=True)
    gst_number = models.CharField(max_length=20, blank=True)
    shop_logo = models.ImageField(upload_to='shop_logos/', blank=True, null=True)
    shop_address = models.TextField(blank=True)
    shop_phone = models.CharField(max_length=15, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.shop_name
