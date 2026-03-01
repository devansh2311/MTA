from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.CreateOrderView.as_view(), name='create-order'),
    path('verify-payment/', views.VerifyPaymentView.as_view(), name='verify-payment'),
    path('', views.UserOrderListView.as_view(), name='user-orders'),
    path('<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('owner/', views.OwnerOrderListView.as_view(), name='owner-orders'),
    path('owner/stats/', views.OwnerStatsView.as_view(), name='owner-stats'),
    path('owner/customers/', views.OwnerCustomerListView.as_view(), name='owner-customers'),
    path('owner/<int:pk>/status/', views.UpdateOrderStatusView.as_view(), name='update-order-status'),
]
