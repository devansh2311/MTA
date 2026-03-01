from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.CustomerRegisterView.as_view(), name='customer-register'),
    path('owner/register/', views.OwnerRegisterView.as_view(), name='owner-register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('owner/profile/', views.OwnerProfileView.as_view(), name='owner-profile'),
]
