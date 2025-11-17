"""Test login endpoint directly"""
import asyncio
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login():
    """Test login endpoint"""
    print("[INFO] Тестирование эндпоинта /api/platform/login...")
    
    response = client.post(
        "/api/platform/login",
        json={
            "login": "89535574133",
            "password": "Tehnologick987"
        }
    )
    
    print(f"[INFO] Status code: {response.status_code}")
    print(f"[INFO] Response: {response.text[:200]}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"[OK] Вход успешен!")
        print(f"  Token: {data.get('token', 'N/A')[:30]}...")
        print(f"  Role: {data.get('role', 'N/A')}")
    else:
        print(f"[ERROR] Ошибка входа: {response.status_code}")
        try:
            error_data = response.json()
            print(f"  Detail: {error_data.get('detail', 'N/A')}")
        except:
            print(f"  Response: {response.text[:500]}")

if __name__ == '__main__':
    test_login()

