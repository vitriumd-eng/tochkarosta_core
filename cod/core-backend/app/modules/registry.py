"""
Module Registry - Load and manage module registry
"""
import yaml
import json
from pathlib import Path
from typing import Dict, List, Optional

REGISTRY_PATH = Path(__file__).parent / "registry.yaml"
MODULES_DIR = Path(__file__).parent.parent.parent.parent / "modules"


def load_registry() -> List[Dict]:
    """Load registry from YAML file"""
    if not REGISTRY_PATH.exists():
        return []
    
    with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
        registry = yaml.safe_load(f) or []
    return registry


def get_module_manifest(module_id: str) -> Optional[Dict]:
    """Load manifest.json for module"""
    manifest_path = MODULES_DIR / module_id / "manifest.json"
    if not manifest_path.exists():
        return None
    
    with open(manifest_path, "r", encoding="utf-8") as f:
        return json.load(f)


def is_module_registered(module_id: str) -> bool:
    """Check if module is registered in registry"""
    registry = load_registry()
    return any(m.get("id") == module_id for m in registry)


def get_registered_modules() -> List[str]:
    """Get list of registered module IDs"""
    registry = load_registry()
    return [m.get("id") for m in registry if m.get("id")]



