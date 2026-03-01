import os
import django
import sys

# Add backend directory to Python path
sys.path.append(r'c:\Users\Devansh Aggarwal\Desktop\MTA\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Category, Product
from django.utils.text import slugify

def update_database():
    print("Starting database migration for Mohindra Handloom...")
    
    # Define the new categories
    new_categories = [
        {'name': 'Bedsheets', 'description': 'Premium pure cotton and blended bedsheets in various sizes.'},
        {'name': 'Curtains', 'description': 'Elegant curtains and drapes for living rooms and bedrooms.'},
        {'name': 'Towels', 'description': 'Soft, highly absorbent bath and hand towels.'},
        {'name': 'Rajai & Blankets', 'description': 'Warm and cozy winter quilts, razais, and blankets.'},
        {'name': 'Footmats & Carpets', 'description': 'Durable and stylish floor coverings for every room.'},
        {'name': 'Pillows & Quilts', 'description': 'Comfortable pillows and lightweight summer quilts.'},
        {'name': 'Handicrafts', 'description': 'Beautiful handcrafted decor items.'},
        {'name': 'Baby Items', 'description': 'Soft and safe textiles for infants and toddlers.'},
    ]

    # Create new categories
    for cat_data in new_categories:
        Category.objects.get_or_create(
            slug=slugify(cat_data['name']),
            defaults=cat_data
        )
    print(f"Created {len(new_categories)} new home textile categories.")

    # Delete the old categories and their associated products using CASCADE
    # The old categories from the seed script were:
    old_category_names = ['Sarees', 'Stoles & Shawls', 'Fabrics', 'Home Textiles', 'Dupattas', 'Kurtas & Dress Material']
    
    deleted_count, _ = Category.objects.filter(name__in=old_category_names).delete()
    print(f"Deleted {deleted_count} old categories (and their associated products).")

    print("Database migration complete.")

if __name__ == '__main__':
    update_database()
