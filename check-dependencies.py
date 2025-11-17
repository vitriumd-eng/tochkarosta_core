"""
Скрипт для проверки зависимостей
"""
import sys
import os
import subprocess

def check_package(package_name, import_name=None):
    """Проверить установлен ли пакет"""
    if import_name is None:
        import_name = package_name
    
    try:
        module = __import__(import_name)
        version = getattr(module, '__version__', 'OK')
        return True, version
    except ImportError:
        return False, None

def main():
    """Основная функция"""
    print("=== ПРОВЕРКА ЗАВИСИМОСТЕЙ ===")
    print()
    
    # Зависимости бэкенда
    backend_packages = [
        ("fastapi", "fastapi"),
        ("uvicorn", "uvicorn"),
        ("asyncpg", "asyncpg"),
        ("pydantic", "pydantic"),
        ("bcrypt", "bcrypt"),
        ("python-jose", "jose"),
        ("cryptography", "cryptography"),
        ("python-multipart", None),
        ("pyyaml", "yaml"),
        ("pydantic-settings", "pydantic_settings"),
    ]
    
    print("БЭКЕНД:")
    missing = []
    for package_name, import_name in backend_packages:
        if import_name is None:
            # Для python-multipart проверяем по имени пакета
            result = subprocess.run(
                [sys.executable, "-m", "pip", "show", package_name],
                capture_output=True,
                text=True
            )
            installed = result.returncode == 0
            if installed:
                version_line = [line for line in result.stdout.split('\n') if line.startswith('Version:')]
                version = version_line[0].split(':')[1].strip() if version_line else "OK"
                print(f"  OK {package_name} == {version}")
            else:
                print(f"  MISSING {package_name}")
                missing.append(package_name)
        else:
            installed, version = check_package(package_name, import_name)
            if installed:
                print(f"  OK {package_name} == {version}")
            else:
                print(f"  MISSING {package_name}")
                missing.append(package_name)
    
    if missing:
        print()
        print(f"Найдено {len(missing)} отсутствующих пакетов:")
        for pkg in missing:
            print(f"  - {pkg}")
        print()
        print("Для установки выполните:")
        print("  cd core-backend")
        print("  .\\venv\\Scripts\\pip.exe install -r requirements.txt")
    else:
        print()
        print("Все зависимости установлены!")
    
    print()

if __name__ == "__main__":
    main()

