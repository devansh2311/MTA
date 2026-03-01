from rest_framework import serializers
from .models import Category, Product, ProductImage, Review


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.ReadOnlyField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'parent', 'product_count']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_avatar = serializers.ImageField(source='user.avatar', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'user_avatar', 'rating', 'title',
                  'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product listings."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    effective_price = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    owner_shop = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'short_description', 'price', 'discount_price',
                  'effective_price', 'discount_percentage', 'category', 'category_name',
                  'primary_image', 'average_rating', 'review_count', 'stock', 'material',
                  'origin', 'is_featured', 'owner_shop', 'created_at']

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if not primary:
            primary = obj.images.first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
            return primary.image.url
        return None

    def get_owner_shop(self, obj):
        if hasattr(obj.owner, 'owner_profile'):
            return obj.owner.owner_profile.shop_name
        return obj.owner.username


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full product detail serializer."""
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    effective_price = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    owner_shop = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'short_description', 'price',
                  'discount_price', 'effective_price', 'discount_percentage', 'category',
                  'images', 'average_rating', 'review_count', 'reviews', 'stock',
                  'material', 'weave_type', 'origin', 'dimensions', 'weight',
                  'care_instructions', 'return_policy', 'replacement_allowed',
                  'is_active', 'is_featured', 'owner_shop',
                  'created_at', 'updated_at']

    def get_owner_shop(self, obj):
        if hasattr(obj.owner, 'owner_profile'):
            return obj.owner.owner_profile.shop_name
        return obj.owner.username


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for owners to create/update products."""
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'short_description', 'price',
                  'discount_price', 'category', 'stock', 'material', 'weave_type',
                  'origin', 'dimensions', 'weight', 'care_instructions',
                  'return_policy', 'replacement_allowed', 'is_active', 'is_featured']

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)
