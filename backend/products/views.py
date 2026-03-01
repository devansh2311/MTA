from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductImage, Review
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ProductCreateUpdateSerializer, ReviewSerializer, ProductImageSerializer
)


class IsOwner(permissions.BasePermission):
    """Only allow owners to create/edit products."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'owner'

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class IsImageOwner(permissions.BasePermission):
    """Only allow the owner of the product that the image belongs to."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'owner'

    def has_object_permission(self, request, view, obj):
        return obj.product.owner == request.user


class CategoryListView(generics.ListAPIView):
    """List all active categories."""
    queryset = Category.objects.filter(is_active=True, parent=None)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class CategoryDetailView(generics.RetrieveAPIView):
    """Get category detail with its products."""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ProductListView(generics.ListAPIView):
    """List all active products with filtering, search, and pagination."""
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'material', 'is_featured']
    search_fields = ['name', 'description', 'origin', 'weave_type']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('category', 'owner')
        # Filter by category slug
        category_slug = self.request.query_params.get('category_slug')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    """Get full product detail by slug."""
    queryset = Product.objects.filter(is_active=True).select_related('category', 'owner')
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class FeaturedProductsView(generics.ListAPIView):
    """List featured products for homepage."""
    queryset = Product.objects.filter(is_active=True, is_featured=True)[:8]
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class OwnerProductListView(generics.ListAPIView):
    """List products owned by the current owner."""
    serializer_class = ProductListSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user).select_related('category')


class ProductCreateView(generics.CreateAPIView):
    """Create a new product (owner only)."""
    serializer_class = ProductCreateUpdateSerializer
    permission_classes = [IsOwner]


class ProductUpdateView(generics.UpdateAPIView):
    """Update a product (owner only, must be own product)."""
    serializer_class = ProductCreateUpdateSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)


class ProductDeleteView(generics.DestroyAPIView):
    """Delete a product (owner only, must be own product)."""
    permission_classes = [IsOwner]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)


class ProductImageUploadView(generics.CreateAPIView):
    """Upload an image for a product (owner only)."""
    serializer_class = ProductImageSerializer
    permission_classes = [IsOwner]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        product_id = self.kwargs.get('product_id')
        product = Product.objects.get(id=product_id, owner=self.request.user)
        serializer.save(product=product)


class ProductImageDeleteView(generics.DestroyAPIView):
    """Delete an image (owner only, must own the product)."""
    serializer_class = ProductImageSerializer
    permission_classes = [IsImageOwner]

    def get_queryset(self):
        return ProductImage.objects.filter(product__owner=self.request.user)


class ProductImageSetPrimaryView(generics.UpdateAPIView):
    """Set an image as the primary/hero image (owner only)."""
    serializer_class = ProductImageSerializer
    permission_classes = [IsImageOwner]

    def get_queryset(self):
        return ProductImage.objects.filter(product__owner=self.request.user)

    def patch(self, request, *args, **kwargs):
        image = self.get_object()
        # Unset all other primary images for this product
        ProductImage.objects.filter(product=image.product, is_primary=True).update(is_primary=False)
        image.is_primary = True
        image.save()
        return Response(ProductImageSerializer(image).data)


class ReviewListCreateView(generics.ListCreateAPIView):
    """List and create reviews for a product."""
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs['product_id'])

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            product_id=self.kwargs['product_id']
        )
