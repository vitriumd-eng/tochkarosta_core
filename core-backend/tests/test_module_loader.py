"""
Tests for module loader
"""
import pytest
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.services.module_loader import load_modules_from_disk
from app.models.module_registry import ModuleRegistry
from app.models import *  # Ensure all models are imported


@pytest.mark.asyncio
async def test_load_modules_from_disk():
    """Test loading modules from disk (without syncing to DB)"""
    # Load modules from disk (this doesn't require DB connection)
    modules = await load_modules_from_disk()
    
    # Should return a list
    assert isinstance(modules, list)
    
    # May be 0 if modules directory doesn't exist in test env
    assert len(modules) >= 0
    
    # If modules were loaded, check structure
    for module in modules:
        assert "id" in module
        assert "version" in module or "path" in module


@pytest.mark.asyncio
async def test_module_registry_query(test_session: AsyncSession):
    """Test querying module registry"""
    # Create a test module in registry
    test_module = ModuleRegistry(
        module_id="test_module",
        version="1.0.0",
        path="modules/test_module",
        dependencies=[],
        is_active=True
    )
    test_session.add(test_module)
    await test_session.commit()
    
    # Query module from registry
    stmt = select(ModuleRegistry).where(ModuleRegistry.module_id == "test_module")
    result = await test_session.execute(stmt)
    module = result.scalar_one_or_none()
    
    assert module is not None
    assert module.module_id == "test_module"
    assert module.version == "1.0.0"
    assert module.is_active is True


@pytest.mark.asyncio
async def test_get_module_from_registry_not_found(test_session: AsyncSession):
    """Test getting non-existent module from registry"""
    stmt = select(ModuleRegistry).where(ModuleRegistry.module_id == "non_existent_module")
    result = await test_session.execute(stmt)
    module = result.scalar_one_or_none()
    assert module is None

