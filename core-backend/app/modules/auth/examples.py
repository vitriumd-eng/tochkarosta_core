"""
Примеры использования API аутентификации

Эти примеры можно использовать для тестирования или как документацию
"""
import httpx
import asyncio

BASE_URL = "http://localhost:8000"

async def example_register():
    """Пример регистрации нового пользователя"""
    async with httpx.AsyncClient() as client:
        # 1. Проверка телефона
        response = await client.post(
            f"{BASE_URL}/api/auth/check-phone",
            json={"phone": "+79991234567"}
        )
        print("Check phone:", response.json())
        
        # 2. Отправка кода (в DEV режиме код выводится в консоль backend)
        response = await client.post(
            f"{BASE_URL}/api/auth/send-code",
            json={"phone": "+79991234567"}
        )
        print("Send code:", response.json())
        
        # 3. Полная регистрация (используйте код из консоли backend)
        response = await client.post(
            f"{BASE_URL}/api/auth/register-full",
            json={
                "phone": "+79991234567",
                "code": "123456",  # Код из консоли backend
                "password": "secure_password_123",
                "first_name": "Иван",
                "last_name": "Иванов",
                "employment_type": "individual"
            }
        )
        print("Register:", response.json())
        return response.json().get("access_token")

async def example_login():
    """Пример входа существующего пользователя"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/api/auth/login-password",
            json={
                "phone": "+79991234567",
                "password": "secure_password_123"
            }
        )
        print("Login:", response.json())
        return response.json().get("access_token")

async def example_get_tenant(token: str):
    """Пример получения информации о tenant"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/api/tenants/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        print("Tenant:", response.json())
        return response.json()

async def example_get_tariffs(token: str):
    """Пример получения списка тарифов"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/api/billing/tariffs",
            headers={"Authorization": f"Bearer {token}"}
        )
        print("Tariffs:", response.json())
        return response.json()

if __name__ == "__main__":
    # Пример использования
    async def main():
        # Регистрация
        token = await example_register()
        
        # Или вход
        # token = await example_login()
        
        if token:
            # Получение информации о tenant
            await example_get_tenant(token)
            
            # Получение тарифов
            await example_get_tariffs(token)
    
    asyncio.run(main())







