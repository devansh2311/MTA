"""
Seed data management command.
Creates sample categories, products, and users for development.
Usage: python manage.py seed_data
"""
import os
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from accounts.models import User, OwnerProfile
from products.models import Category, Product, ProductImage, Review


class Command(BaseCommand):
    help = 'Seeds the database with sample handloom product data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Create customer user
        customer, created = User.objects.get_or_create(
            username='customer1',
            defaults={
                'email': 'customer@example.com',
                'first_name': 'Priya',
                'last_name': 'Sharma',
                'role': 'customer',
                'phone': '9876543210',
                'address': '123 MG Road',
                'city': 'Mumbai',
                'state': 'Maharashtra',
                'pincode': '400001',
            }
        )
        if created:
            customer.set_password('customer123')
            customer.save()
            self.stdout.write(self.style.SUCCESS(f'Created customer: {customer.username}'))

        # Create owner user
        owner, created = User.objects.get_or_create(
            username='owner1',
            defaults={
                'email': 'owner@example.com',
                'first_name': 'Rajesh',
                'last_name': 'Weaver',
                'role': 'owner',
                'phone': '9876543211',
            }
        )
        if created:
            owner.set_password('owner12345')
            owner.save()
            OwnerProfile.objects.create(
                user=owner,
                shop_name='Mohindra Handloom',
                shop_description='Premium home textiles from Ambala. High quality bedsheets, curtains, towels, and more.',
                gst_number='29ABCDE1234F1Z5',
                shop_address='Shop No. 1, 2 Shree Ganesh Cloth Market, Ambala City',
                shop_phone='9416114057',
                is_verified=True
            )
            self.stdout.write(self.style.SUCCESS(f'Created owner: {owner.username}'))

        # Create a second owner
        owner2, created = User.objects.get_or_create(
            username='owner2',
            defaults={
                'email': 'owner2@example.com',
                'first_name': 'Meena',
                'last_name': 'Devi',
                'role': 'owner',
                'phone': '9876543212',
            }
        )
        if created:
            owner2.set_password('owner12345')
            owner2.save()
            OwnerProfile.objects.create(
                user=owner2,
                shop_name='Ambala Comforts',
                shop_description='Wholesalers of the finest winter quilts, razais, and luxury bed covers in Haryana.',
                gst_number='33FGHIJ5678K2Z1',
                shop_address='Main Market, Ambala City, Haryana',
                shop_phone='9876543212',
                is_verified=True
            )
            self.stdout.write(self.style.SUCCESS(f'Created owner: {owner2.username}'))

        # Create categories
        categories_data = [
            {'name': 'Bedsheets', 'description': 'Premium pure cotton and blended bedsheets in various sizes.'},
            {'name': 'Curtains', 'description': 'Elegant curtains and drapes for living rooms and bedrooms.'},
            {'name': 'Towels', 'description': 'Soft, highly absorbent bath and hand towels.'},
            {'name': 'Rajai & Blankets', 'description': 'Warm and cozy winter quilts, razais, and blankets.'},
            {'name': 'Footmats & Carpets', 'description': 'Durable and stylish floor coverings for every room.'},
            {'name': 'Pillows & Quilts', 'description': 'Comfortable pillows and lightweight summer quilts.'},
            {'name': 'Handicrafts', 'description': 'Beautiful handcrafted decor items.'},
            {'name': 'Baby Items', 'description': 'Soft and safe textiles for infants and toddlers.'},
        ]

        categories = {}
        for cat_data in categories_data:
            cat, _ = Category.objects.get_or_create(
                slug=slugify(cat_data['name']),
                defaults={**cat_data}
            )
            categories[cat.name] = cat

        self.stdout.write(self.style.SUCCESS(f'Created {len(categories)} categories'))

        # Create products
        products_data = [
            {
                'name': 'Pure Cotton Bedsheet - Floral Queen Size',
                'description': '100% pure cotton queen size bedsheet with vibrant floral prints. Includes two matching pillow covers. Long-lasting, fade-resistant, and perfect for summer nights.',
                'short_description': 'Soft cotton queen bedsheet with 2 pillow covers',
                'price': 1499.00,
                'discount_price': 999.00,
                'category': categories['Bedsheets'],
                'owner': owner,
                'stock': 50,
                'material': 'cotton',
                'weave_type': 'Percale',
                'origin': 'Ambala City',
                'dimensions': '90x100 inches',
                'weight': '1.2kg',
                'care_instructions': 'Machine wash cold. Do not bleach.',
                'is_featured': True,
            },
            {
                'name': 'Luxury Velvet Curtains - Set of 2',
                'description': 'Heavy luxury velvet curtains for blocking light and adding elegance to your living room. Features sturdy metal eyelets for easy hanging.',
                'short_description': 'Elegant velvet curtains with metal eyelets',
                'price': 2999.00,
                'discount_price': 1999.00,
                'category': categories['Curtains'],
                'owner': owner2,
                'stock': 30,
                'material': 'velvet',
                'weave_type': 'Plain',
                'origin': 'Ambala City',
                'dimensions': '5x7 feet per panel',
                'weight': '1.8kg',
                'care_instructions': 'Dry clean only.',
                'is_featured': True,
            },
            {
                'name': 'Plush Bath Towel Set - 100% Cotton',
                'description': 'Set of 4 ultra-soft, highly absorbent 100% cotton bath towels. Quick-drying and gentle on the skin, available in modern neutral colors.',
                'short_description': 'Set of 4 quick-dry cotton bath towels',
                'price': 1999.00,
                'discount_price': 1499.00,
                'category': categories['Towels'],
                'owner': owner,
                'stock': 100,
                'material': 'cotton',
                'weave_type': 'Terry',
                'origin': 'Haryana',
                'dimensions': '27x54 inches',
                'weight': '600g each',
                'care_instructions': 'Machine wash warm, tumble dry low.',
                'is_featured': True,
            },
            {
                'name': 'Traditional Jaipuri Razai (Winter Quilt)',
                'description': 'Authentic traditional hand-stitched Jaipuri Razai (quilt). Lightweight yet incredibly warm, featuring intricate block prints.',
                'short_description': 'Warm and lightweight printed winter quilt',
                'price': 3499.00,
                'discount_price': 2799.00,
                'category': categories['Rajai & Blankets'],
                'owner': owner2,
                'stock': 20,
                'material': 'cotton',
                'weave_type': 'Quilted',
                'origin': 'Jaipur',
                'dimensions': '90x108 inches',
                'weight': '2kg',
                'care_instructions': 'Dry clean only. Air out occasionally.',
                'is_featured': True,
            },
            {
                'name': 'Anti-Slip Entrance Footmat',
                'description': 'Durable anti-slip entrance footmat made from natural coir. Traps dirt and moisture effectively while adding a rustic charm to your doorstep.',
                'short_description': 'Durable natural coir anti-slip entrance mat',
                'price': 499.00,
                'discount_price': 349.00,
                'category': categories['Footmats & Carpets'],
                'owner': owner,
                'stock': 150,
                'material': 'coir',
                'weave_type': 'Tufted',
                'origin': 'Ambala',
                'dimensions': '18x30 inches',
                'weight': '800g',
                'care_instructions': 'Shake to clean or vacuum. Keep dry.',
                'is_featured': False,
            },
            {
                'name': 'Orthopedic Memory Foam Pillow',
                'description': 'Ergonomically designed memory foam pillow offering excellent neck support. Alleviates pain and ensures a comfortable night\'s sleep.',
                'short_description': 'Neck-support memory foam bed pillow',
                'price': 1299.00,
                'discount_price': 899.00,
                'category': categories['Pillows & Quilts'],
                'owner': owner2,
                'stock': 80,
                'material': 'foam',
                'weave_type': 'Moulded',
                'origin': 'Haryana',
                'dimensions': '24x16 inches',
                'weight': '1.1kg',
                'care_instructions': 'Spot clean only. Use a pillowcase.',
                'is_featured': False,
            }
        ]

        for prod_data in products_data:
            prod, created = Product.objects.get_or_create(
                slug=slugify(prod_data['name']),
                defaults=prod_data
            )
            if created:
                self.stdout.write(f'  Created product: {prod.name}')

        # Create some reviews
        products = Product.objects.all()
        review_data = [
            {'rating': 5, 'title': 'Absolutely stunning!', 'comment': 'The quality of the weave is exceptional. The colors are vibrant and true to the photos. Received it well-packaged and ahead of schedule.'},
            {'rating': 4, 'title': 'Beautiful craftsmanship', 'comment': 'Lovely handloom product. Slightly different shade than expected but the quality more than makes up for it.'},
            {'rating': 5, 'title': 'Worth every penny', 'comment': 'Supporting authentic handloom artisans. The product is gorgeous and the attention to detail is remarkable.'},
            {'rating': 4, 'title': 'Great quality', 'comment': 'Very happy with the purchase. The fabric feels premium and the patterns are intricate.'},
            {'rating': 3, 'title': 'Good but could be better', 'comment': 'Nice product overall. Took a bit longer to deliver than expected.'},
        ]

        for i, product in enumerate(products[:8]):
            for j, rev in enumerate(review_data[:min(3, len(review_data))]):
                Review.objects.get_or_create(
                    product=product,
                    user=customer,
                    defaults=rev
                )
                break  # One review per product from our single customer

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
        self.stdout.write(f'\n  Customer login: username=customer1, password=customer123')
        self.stdout.write(f'  Owner login: username=owner1, password=owner12345')
        self.stdout.write(f'  Owner 2 login: username=owner2, password=owner12345')
