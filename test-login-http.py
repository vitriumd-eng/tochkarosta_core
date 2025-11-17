"""
Тест HTTP запроса к API логина
"""
import asyncio
import httpx

async def test_login():
    """Тест входа через HTTP"""
    print("=== Тест HTTP запроса к /api/platform/login ===")
    print()
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                'http://localhost:8000/api/platform/login',
                json={
                    'login': '89535574133',
                    'password': 'Tehnologick987'
                },
                timeout=10.0
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Headers: {dict(response.headers)}")
            print()
            
            if response.status_code == 200:
                data = response.json()
                print("[OK] Вход успешен!")
                print(f"   Токен: {data['token'][:50]}...")
                print(f"   Роль: {data['role']}")
                return True
            else:
                print(f"[ERROR] Вход не удался")
                print(f"   Response: {response.text[:500]}")
                try:
                    error_data = response.json()
                    print(f"   Error detail: {error_data.get('detail', 'Unknown')}")
                except:
                    pass
                return False
                
    except Exception as e:
        print(f"[ERROR] Ошибка запроса: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    asyncio.run(test_login())

