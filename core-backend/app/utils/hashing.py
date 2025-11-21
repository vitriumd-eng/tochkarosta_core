from passlib.context import CryptContext

# Используем passlib с bcrypt 4.0.1 для совместимости
# bcrypt 4.0.1 совместим с passlib 1.7.4
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__ident="2b",
    bcrypt__rounds=12,
)

def get_password_hash(password: str) -> str:
    """Хеширует пароль используя passlib (bcrypt)"""
    # Bcrypt имеет ограничение в 72 байта, обрезаем если нужно
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
        password = password_bytes.decode('utf-8', errors='ignore')
    
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверяет пароль против хеша"""
    try:
        # Обрезаем пароль до 72 байт
        password_bytes = plain_password.encode('utf-8')
        if len(password_bytes) > 72:
            password_bytes = password_bytes[:72]
            plain_password = password_bytes.decode('utf-8', errors='ignore')
        
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False