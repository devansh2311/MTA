from django.contrib import admin
from .models import Category, Product, ProductImage, Review


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'parent', 'is_active', 'product_count']
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ['is_active', 'parent']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'discount_price', 'category', 'owner', 'stock', 'is_active', 'is_featured']
    list_filter = ['category', 'material', 'is_active', 'is_featured']
    search_fields = ['name', 'description', 'origin']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'created_at']
    list_filter = ['rating']
