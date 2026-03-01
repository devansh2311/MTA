from django.urls import path
from . import views

urlpatterns = [
    path('', views.ContactMessageCreateView.as_view(), name='contact-submit'),
    path('owner/messages/', views.OwnerContactMessageListView.as_view(), name='owner-messages'),
]
