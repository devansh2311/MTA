from django.contrib import admin
from .models import User, OwnerProfile

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active']
    search_fields = ['username', 'email']

@admin.register(OwnerProfile)
class OwnerProfileAdmin(admin.ModelAdmin):
    list_display = ['shop_name', 'user', 'is_verified', 'created_at']
    list_filter = ['is_verified']
    search_fields = ['shop_name']
