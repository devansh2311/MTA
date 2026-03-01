import requests
import json

base_url = "http://localhost:8000/api"

def get_tokens():
    resp = requests.post(f"{base_url}/auth/login/", json={
        "username": "customer1",
        "password": "customer123"
    })
    return resp.json().get("tokens", {}).get("access")

try:
    token = get_tokens()
    if not token:
        # maybe customer1 doesn't exist, let's create or find one.
        pass
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # 1. Test profile update
    print("Testing Profile Update (PATCH)...")
    data = {
        "first_name": "Test",
        "last_name": "Customer",
        "phone": "9876543210",
        "address": "123 Test St",
        "city": "Testville",
        "state": "TestState",
        "pincode": "123456"
    }
    resp = requests.patch(f"{base_url}/auth/profile/", json=data, headers=headers)
    print(f"Profile Update PATCH Status: {resp.status_code}")
    print(f"Profile Update PATCH Response: {resp.text}")

except Exception as e:
    print(f"Error: {e}")
