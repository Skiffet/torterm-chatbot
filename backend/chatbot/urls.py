from django.urls import path
from . import views

urlpatterns = [
    path('chat/', views.chat_endpoint, name='chat_endpoint'),
    path('analyze/', views.analyze_house, name='analyze_house'),
]
