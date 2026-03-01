from django.db import models
from django.utils.text import slugify
from accounts.models import User


class Category(models.Model):
    """Product categories with optional parent for subcategories."""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def product_count(self):
        return self.products.filter(is_active=True).count()


class Product(models.Model):
    """Handloom product listing."""
    MATERIAL_CHOICES = [
        ('cotton', 'Cotton'),
        ('silk', 'Silk'),
        ('wool', 'Wool'),
        ('jute', 'Jute'),
        ('linen', 'Linen'),
        ('polyester', 'Polyester'),
        ('blend', 'Blend'),
        ('other', 'Other'),
    ]

    RETURN_POLICY_CHOICES = [
        ('no_return', 'No Return Policy'),
        ('7_days', '7-Day Return'),
        ('10_days', '10-Day Return'),
        ('15_days', '15-Day Return'),
        ('30_days', '30-Day Return'),
    ]

    name = models.CharField(max_length=300)
    slug = models.SlugField(max_length=300, unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    stock = models.PositiveIntegerField(default=0)
    material = models.CharField(max_length=20, choices=MATERIAL_CHOICES, default='cotton')
    weave_type = models.CharField(max_length=100, blank=True)
    origin = models.CharField(max_length=200, blank=True, help_text='Place of origin e.g. Varanasi, Kanchipuram')
    dimensions = models.CharField(max_length=100, blank=True, help_text='e.g. 6.5m x 1.2m')
    weight = models.CharField(max_length=50, blank=True)
    care_instructions = models.TextField(blank=True)
    return_policy = models.CharField(max_length=20, choices=RETURN_POLICY_CHOICES, default='no_return')
    replacement_allowed = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            # Ensure unique slug
            if Product.objects.filter(slug=self.slug).exists():
                self.slug = f"{self.slug}-{self.pk or 'new'}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            return round(reviews.aggregate(models.Avg('rating'))['rating__avg'], 1)
        return 0

    @property
    def review_count(self):
        return self.reviews.count()

    @property
    def effective_price(self):
        return self.discount_price if self.discount_price else self.price

    @property
    def discount_percentage(self):
        if self.discount_price and self.price > 0:
            return round(((self.price - self.discount_price) / self.price) * 100)
        return 0


class ProductImage(models.Model):
    """Multiple images per product."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.product.name}"


class Review(models.Model):
    """Product reviews by customers."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('product', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.username} for {self.product.name}"
