from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('', views.ProductListView.as_view(), name='product-list'),
    path('featured/', views.FeaturedProductsView.as_view(), name='featured-products'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('<int:product_id>/reviews/', views.ReviewListCreateView.as_view(), name='product-reviews'),
    # Owner endpoints
    path('owner/my-products/', views.OwnerProductListView.as_view(), name='owner-products'),
    path('owner/create/', views.ProductCreateView.as_view(), name='product-create'),
    path('owner/update/<int:pk>/', views.ProductUpdateView.as_view(), name='product-update'),
    path('owner/delete/<int:pk>/', views.ProductDeleteView.as_view(), name='product-delete'),
    path('owner/upload-image/<int:product_id>/', views.ProductImageUploadView.as_view(), name='product-image-upload'),
    path('owner/delete-image/<int:pk>/', views.ProductImageDeleteView.as_view(), name='product-image-delete'),
    path('owner/set-primary-image/<int:pk>/', views.ProductImageSetPrimaryView.as_view(), name='product-image-set-primary'),
]
