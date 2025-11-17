"""
Module Loader Service - Autoload modules from /modules/*/manifest.json
"""
import json
from pathlib import Path
from typing import Dict, List, Optional
import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.models.module_registry import ModuleRegistry

logger = logging.getLogger(__name__)

MODULES_DIR = Path(__file__).parent.parent.parent.parent / "modules"


async def load_modules_from_disk() -> List[Dict]:
    """
    Autoload modules from /modules/*/manifest.json
    Returns list of module manifests
    """
    modules = []
    
    if not MODULES_DIR.exists():
        logger.warning(f"Modules directory not found: {MODULES_DIR}")
        return modules
    
    for module_dir in MODULES_DIR.iterdir():
        if not module_dir.is_dir():
            continue
        
        manifest_path = module_dir / "manifest.json"
        if not manifest_path.exists():
            logger.debug(f"Module {module_dir.name} has no manifest.json, skipping")
            continue
        
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest = json.load(f)
            
            # Add path to manifest
            manifest["path"] = str(module_dir.relative_to(MODULES_DIR.parent))
            
            modules.append(manifest)
            logger.info(f"Loaded module: {manifest.get('id', module_dir.name)}")
        except Exception as e:
            logger.error(f"Failed to load manifest for {module_dir.name}: {e}", exc_info=True)
    
    return modules


async def sync_modules_to_registry() -> int:
    """
    Sync modules from disk to database registry
    Returns number of synced modules
    """
    modules_from_disk = await load_modules_from_disk()
    synced_count = 0
    
    async with AsyncSessionLocal() as db:
        for manifest in modules_from_disk:
            module_id = manifest.get("id")
            if not module_id:
                logger.warning(f"Module manifest missing 'id': {manifest}")
                continue
            
            # Check if module exists in registry
            stmt = select(ModuleRegistry).where(ModuleRegistry.module_id == module_id)
            result = await db.execute(stmt)
            existing = result.scalar_one_or_none()
            
            if existing:
                # Update existing module
                existing.version = manifest.get("version", "1.0.0")
                existing.path = manifest.get("path", "")
                existing.dependencies = manifest.get("dependencies", [])
                existing.is_active = True
                logger.debug(f"Updated module in registry: {module_id}")
            else:
                # Create new module entry
                new_module = ModuleRegistry(
                    module_id=module_id,
                    version=manifest.get("version", "1.0.0"),
                    path=manifest.get("path", ""),
                    dependencies=manifest.get("dependencies", []),
                    is_active=True
                )
                db.add(new_module)
                logger.info(f"Added module to registry: {module_id}")
            
            synced_count += 1
        
        try:
            await db.commit()
            logger.info(f"Synced {synced_count} modules to registry")
        except Exception as e:
            await db.rollback()
            logger.error(f"Failed to sync modules to registry: {e}", exc_info=True)
            raise
    
    return synced_count


async def get_module_from_registry(module_id: str) -> Optional[ModuleRegistry]:
    """Get module from database registry"""
    async with AsyncSessionLocal() as db:
        stmt = select(ModuleRegistry).where(ModuleRegistry.module_id == module_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()





