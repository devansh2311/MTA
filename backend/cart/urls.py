from django.urls import path
from . import views

urlpatterns = [
    path('', views.CartView.as_view(), name='cart'),
    path('add/', views.AddToCartView.as_view(), name='add-to-cart'),
    path('update/<int:pk>/', views.UpdateCartItemView.as_view(), name='update-cart-item'),
    path('remove/<int:pk>/', views.RemoveCartItemView.as_view(), name='remove-cart-item'),
    path('clear/', views.ClearCartView.as_view(), name='clear-cart'),
    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('wishlist/add/', views.AddToWishlistView.as_view(), name='add-to-wishlist'),
    path('wishlist/remove/<int:pk>/', views.RemoveFromWishlistView.as_view(), name='remove-from-wishlist'),
]
