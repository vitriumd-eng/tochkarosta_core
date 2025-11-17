#!/usr/bin/env python
"""Test script to check route registration"""
import sys
sys.path.insert(0, '.')

try:
    from app.api.v1.routes import auth
    print("✓ Import auth OK")
    
    print(f"\nRouter: {auth.router}")
    print(f"Routes count: {len(auth.router.routes)}")
    
    print("\nRegistered routes:")
    for route in auth.router.routes:
        if hasattr(route, 'path'):
            methods = getattr(route, 'methods', set())
            methods_str = ', '.join(methods) if methods else 'N/A'
            print(f"  {route.path} [{methods_str}]")
        else:
            print(f"  {type(route).__name__}: {route}")
    
    # Check specific endpoints
    paths = [r.path for r in auth.router.routes if hasattr(r, 'path')]
    if '/request_code' in paths:
        print("\n✓ /request_code endpoint found")
    else:
        print("\n✗ /request_code endpoint NOT found")
        
    if '/confirm_code' in paths:
        print("✓ /confirm_code endpoint found")
    else:
        print("✗ /confirm_code endpoint NOT found")
        
except Exception as e:
    print(f"✗ ERROR: {e}")
    import traceback
    traceback.print_exc()


