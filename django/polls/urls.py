from django.urls import path, include, re_path

from . import views
from .apiviews import login,get_opros,add_opros,receive_poll, MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', views.index, name='index'),
    path('user/login',login),
    path('user/token', MyTokenObtainPairView.as_view(), name='token_pair'),
    path('user/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('poll',get_opros),
    path('poll/<slug:slug>/',get_opros),
    path('poll/create',add_opros),
    path('poll/receive',receive_poll),
]
