#!/usr/bin/env python3
"""
Helper script to run module migrations
Usage: python scripts/migrate.py <tenant_id> [revision]
"""
import sys
import os
import asyncio
from pathlib import Path

# Add paths for imports
sys.path.insert(0, str(Path(__file__).parent.parent))
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

# Try to import SDK
try:
    from app.modules.sdk import get_tenant_database_url
except ImportError:
    core_backend_path = Path(__file__).parent.parent.parent.parent / "core-backend"
    if core_backend_path.exists():
        sys.path.insert(0, str(core_backend_path))
        from app.modules.sdk import get_tenant_database_url
    else:
        print("Error: Cannot import SDK. Make sure core-backend is in the path.")
        sys.exit(1)


async def run_migrations(tenant_id: str, revision: str = "head"):
    """Run migrations for a specific tenant"""
    import subprocess
    
    # Set environment variables for Alembic
    os.environ["MIGRATION_TENANT_ID"] = tenant_id
    os.environ["MIGRATION_MODULE_ID"] = "shop"
    
    # Change to module backend directory
    module_backend_dir = Path(__file__).parent.parent
    os.chdir(module_backend_dir)
    
    # Run Alembic upgrade
    try:
        result = subprocess.run(
            ["alembic", "upgrade", revision],
            check=True,
            capture_output=True,
            text=True
        )
        print(result.stdout)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        print(f"✓ Migrations applied successfully for tenant {tenant_id}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Migration failed: {e}", file=sys.stderr)
        if e.stdout:
            print(e.stdout, file=sys.stderr)
        if e.stderr:
            print(e.stderr, file=sys.stderr)
        return False


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/migrate.py <tenant_id> [revision]")
        print("Example: python scripts/migrate.py 123e4567-e89b-12d3-a456-426614174000")
        print("Example: python scripts/migrate.py 123e4567-e89b-12d3-a456-426614174000 head")
        sys.exit(1)
    
    tenant_id = sys.argv[1]
    revision = sys.argv[2] if len(sys.argv) > 2 else "head"
    
    print(f"Running migrations for tenant: {tenant_id}")
    print(f"Target revision: {revision}")
    
    success = asyncio.run(run_migrations(tenant_id, revision))
    sys.exit(0 if success else 1)

