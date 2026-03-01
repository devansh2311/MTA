from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, OwnerProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role',
                  'phone', 'address', 'city', 'state', 'pincode', 'avatar']
        read_only_fields = ['id', 'role']


class CustomerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'phone']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role='customer'
        )
        return user


class OwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerProfile
        fields = ['id', 'shop_name', 'shop_description', 'gst_number',
                  'shop_logo', 'shop_address', 'shop_phone', 'is_verified', 'created_at']
        read_only_fields = ['id', 'is_verified', 'created_at']


class OwnerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)
    shop_name = serializers.CharField(max_length=200)
    shop_description = serializers.CharField(required=False, allow_blank=True)
    gst_number = serializers.CharField(max_length=20, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name',
                  'phone', 'shop_name', 'shop_description', 'gst_number']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        return data

    def create(self, validated_data):
        shop_name = validated_data.pop('shop_name')
        shop_description = validated_data.pop('shop_description', '')
        gst_number = validated_data.pop('gst_number', '')
        validated_data.pop('password2')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role='owner'
        )
        OwnerProfile.objects.create(
            user=user,
            shop_name=shop_name,
            shop_description=shop_description,
            gst_number=gst_number
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials.")
        if not user.is_active:
            raise serializers.ValidationError("Account is disabled.")
        data['user'] = user
        return data
