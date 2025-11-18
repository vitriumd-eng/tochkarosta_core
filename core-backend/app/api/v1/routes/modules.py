"""
Modules API - SDK endpoints for modules
"""
from fastapi import APIRouter, Depends, HTTPException
from starlette.requests import Request
from app.modules.registry import load_registry, get_module_manifest

router = APIRouter()


@router.get("/subscription")
async def get_subscription_status(request: Request):
    """SDK endpoint: Get module subscription status for tenant"""
    tenant_id = getattr(request.state, "tenant_id", None)
    if not tenant_id:
        raise HTTPException(status_code=401, detail="No tenant found")
    
    from app.modules.sdk import get_subscription_status
    status = await get_subscription_status(tenant_id)
    return status


@router.get("/tenant-info")
async def get_tenant_info(request: Request):
    """SDK endpoint: Get tenant info"""
    tenant_id = getattr(request.state, "tenant_id", None)
    if not tenant_id:
        raise HTTPException(status_code=401, detail="No tenant found")
    
    from app.modules.sdk import get_tenant_info
    info = await get_tenant_info(tenant_id)
    return info


@router.get("/list")
async def list_modules(request: Request):
    """Get list of available modules for tenant or platform"""
    from app.utils.jwt import verify_token
    import os
    
    # Check if user is platform_master (can access all modules without tenant)
    auth_header = request.headers.get("Authorization", "")
    is_platform_master = False
    tenant_id_from_token = None
    is_dev_mode = os.getenv("ENVIRONMENT", "development").lower() != "production"
    
    if auth_header.startswith("Bearer "):
        token = auth_header.replace("Bearer ", "")
        try:
            payload = verify_token(token)
            role = payload.get("role")
            if role == "platform_master":
                is_platform_master = True
            # Extract tenant_id from token payload
            tenant_id_from_token = payload.get("tenant")
        except Exception:
            # Invalid token - in dev mode, still allow access to modules list
            # This allows dev-login to work with fake tokens
            if is_dev_mode:
                # Try to extract tenant_id from localStorage via query param or header
                tenant_id_from_token = request.headers.get("X-Tenant-ID")
            pass
    
    # For platform_master: return all modules without tenant/subscription check
    if is_platform_master:
        registry = load_registry()
        modules = []
        
        for reg_entry in registry:
            module_id = reg_entry.get("id")
            manifest = get_module_manifest(module_id)
            
            if manifest:
                modules.append({
                    "id": manifest.get("id"),
                    "name": manifest.get("name"),
                    "description": manifest.get("description", ""),
                    "version": manifest.get("version"),
                    "themes": manifest.get("themes", []),
                    "enabled": True,  # All modules enabled for platform_master
                    "installed": True,
                    "active": True
                })
        
        return {"modules": modules}
    
    # For all other cases (including new users during registration):
    # Return all available modules - this is safe as module list is public information
    # This allows module selection page to work right after registration, even with invalid tokens
    registry = load_registry()
    modules = []
    
    for reg_entry in registry:
        module_id = reg_entry.get("id")
        manifest = get_module_manifest(module_id)
        
        if manifest:
            modules.append({
                "id": manifest.get("id"),
                "name": manifest.get("name"),
                "description": manifest.get("description", ""),
                "version": manifest.get("version"),
                "themes": manifest.get("themes", [])
            })
    
    return {"modules": modules}


@router.post("/activate")
async def activate_module(request: Request):
    """
    Activate module for tenant (new flow with internal registration)
    1. Activate module via /auth/activate-module
    2. Call /internal/register in module backend
    3. Send license.updated webhook to module
    """
    from pydantic import BaseModel
    import httpx
    import os
    import logging
    from typing import Optional
    
    logger = logging.getLogger(__name__)
    
    class ActivateModuleRequest(BaseModel):
        tenant_id: str
        module: str
        plan: str = "basic"
        subdomain: Optional[str] = None
    
    # Parse request body
    body = await request.json()
    activate_req = ActivateModuleRequest(**body)
    
    # Get tenant_id from request body or token
    tenant_id = activate_req.tenant_id
    is_dev_mode = os.getenv("ENVIRONMENT", "development").lower() != "production"
    
    # If no tenant_id in body, try to get from token
    if not tenant_id:
        try:
            from app.api.deps.dependencies import get_current_tenant
            tenant_id = str(get_current_tenant(request))
        except Exception:
            if not is_dev_mode:
                raise HTTPException(status_code=401, detail="Tenant not found")
    
    if not tenant_id:
        raise HTTPException(status_code=401, detail="Tenant ID required")
    
    # Get module manifest
    manifest = get_module_manifest(activate_req.module)
    if not manifest:
        raise HTTPException(status_code=404, detail=f"Module '{activate_req.module}' not found")
    
    # Get module backend URL from manifest
    module_backend_port = manifest.get("backend", {}).get("port", 8001)
    module_backend_url = f"http://localhost:{module_backend_port}"  # In production, use service discovery
    
    # Generate subdomain if not provided
    subdomain = activate_req.subdomain or f"{activate_req.module}-{tenant_id[:8]}"
    
    try:
        # Step 1: Activate module via existing /auth/activate-module endpoint
        # We'll call it internally
        from app.api.v1.routes.auth import ActivateModuleRequest as AuthActivateRequest
        from app.services.tenant import TenantService
        from app.services.subscription import SubscriptionService
        from app.modules.registry import is_module_registered
        from app.modules.sdk import check_dependencies
        import uuid
        
        # Validate module
        if not is_module_registered(activate_req.module):
            raise HTTPException(
                status_code=400,
                detail=f"Module '{activate_req.module}' not found or not registered"
            )
        
        # Check dependencies
        deps = await check_dependencies(activate_req.module)
        if not deps.get("ok"):
            raise HTTPException(
                status_code=400,
                detail=f"Module dependencies not met: {deps.get('missing')} {deps.get('inactive')}"
            )
        
        tenant_service = TenantService()
        subscription_service = SubscriptionService()
        
        # Check subdomain availability (before transaction)
        subdomain_available = await tenant_service.check_subdomain_availability(subdomain)
        if not subdomain_available:
            raise HTTPException(
                status_code=400,
                detail=f"Subdomain '{subdomain}' is already taken"
            )
        
        # ALL operations in ONE transaction for atomicity
        from sqlalchemy import select
        from app.models.tenant import Tenant
        from app.db.session import AsyncSessionLocal
        from sqlalchemy.exc import IntegrityError, DatabaseError
        
        tenant_uuid = uuid.UUID(tenant_id)
        
        async with AsyncSessionLocal() as db:
            try:
                # 1. Get tenant with FOR UPDATE lock (prevents race condition)
                tenant_stmt = select(Tenant).where(Tenant.id == tenant_uuid).with_for_update()
                tenant_result = await db.execute(tenant_stmt)
                tenant = tenant_result.scalar_one_or_none()
                
                if not tenant:
                    raise HTTPException(status_code=404, detail="Tenant not found")
                
                # 2. Check if tenant already has active module
                if tenant.active_module:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Tenant already has active module: {tenant.active_module}"
                    )
                
                # 3. Set active module
                tenant.active_module = activate_req.module
                
                # 4. Reserve subdomain (in same transaction)
                await tenant_service.reserve_subdomain(
                    tenant_id=tenant_uuid,
                    subdomain=subdomain,
                    db=db  # Pass session for atomicity
                )
                
                # 5. Create trial subscription (in same transaction)
                subscription = await subscription_service.create_trial_subscription(
                    tenant_id=tenant_uuid,
                    module_id=activate_req.module,
                    db=db  # Pass session for atomicity
                )
                
                # 6. Commit all changes atomically
                await db.commit()
                
                logger.info(
                    f"Module {activate_req.module} activated for tenant {tenant_id}",
                    extra={
                        "tenant_id": tenant_id,
                        "module_id": activate_req.module,
                        "subdomain": subdomain
                    }
                )
                
            except HTTPException:
                await db.rollback()
                raise
            except (IntegrityError, DatabaseError) as e:
                await db.rollback()
                logger.error(
                    f"Database error during module activation: {e}",
                    exc_info=True,
                    extra={"tenant_id": tenant_id, "module_id": activate_req.module}
                )
                raise HTTPException(
                    status_code=500,
                    detail="Failed to activate module due to database error"
                )
            except Exception as e:
                await db.rollback()
                logger.error(
                    f"Unexpected error during module activation: {e}",
                    exc_info=True,
                    extra={"tenant_id": tenant_id, "module_id": activate_req.module}
                )
                raise HTTPException(
                    status_code=500,
                    detail="Failed to activate module"
                )
        
        # Step 2: Call /internal/register in module backend
        # Use retry logic for better resilience (disabled in dev mode if module backend is not available)
        from app.utils.retry import http_request_with_retry
        import os
        
        # Enable retry only in production or if explicitly enabled
        retry_enabled = os.getenv("HTTP_RETRY_ENABLED", "true").lower() == "true"
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                internal_register_url = f"{module_backend_url}/api/v1/internal/register"
                internal_register_payload = {
                    "tenant_id": tenant_id,
                    "module_name": activate_req.module,
                    "plan": activate_req.plan,
                    "version": manifest.get("version", "1.0.0"),
                    "subdomain": f"{subdomain}.localhost",  # In dev mode
                    "callbacks": {
                        "license_updated": f"{module_backend_url}/api/v1/webhooks/license.updated",
                        "version_updated": f"{module_backend_url}/api/v1/webhooks/version.updated"
                    }
                }
                
                logger.info(
                    f"Calling {internal_register_url}",
                    extra={"tenant_id": tenant_id, "module_id": activate_req.module}
                )
                
                try:
                    internal_response = await http_request_with_retry(
                        client,
                        "POST",
                        internal_register_url,
                        max_attempts=3,
                        base_delay=1.0,
                        max_delay=10.0,
                        enabled=retry_enabled,
                        json=internal_register_payload
                    )
                    
                    if not internal_response.is_success:
                        logger.error(
                            f"Module internal register failed: {internal_response.text}",
                            extra={
                                "tenant_id": tenant_id,
                                "module_id": activate_req.module,
                                "status_code": internal_response.status_code
                            }
                        )
                        # In dev mode, continue even if module backend is not available
                        if not is_dev_mode:
                            raise HTTPException(
                                status_code=500,
                                detail="Module registration failed"
                            )
                    else:
                        logger.info(
                            f"Module registered successfully",
                            extra={"tenant_id": tenant_id, "module_id": activate_req.module}
                        )
                except httpx.RequestError as e:
                    logger.warning(
                        f"Failed to call module backend: {e}",
                        extra={"tenant_id": tenant_id, "module_id": activate_req.module},
                        exc_info=True
                    )
                    # In dev mode, continue even if module backend is not available
                    if not is_dev_mode:
                        raise HTTPException(
                            status_code=500,
                            detail="Module backend unavailable"
                        )
        except HTTPException:
            raise
        except Exception as e:
            # Log but don't fail activation if module backend call fails
            # This allows activation to succeed even if module backend is temporarily unavailable
            logger.error(
                f"Unexpected error calling module backend: {e}",
                exc_info=True,
                extra={"tenant_id": tenant_id, "module_id": activate_req.module}
            )
            if not is_dev_mode:
                # In production, we might want to fail, but for now continue
                pass
        
        # Step 3: Send license.updated webhook to module
        # Webhooks are best-effort and don't fail activation if they fail
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                webhook_url = f"{module_backend_url}/api/v1/webhooks/license.updated"
                # Generate webhook ID for idempotency
                import secrets
                webhook_id = secrets.token_urlsafe(16)
                
                webhook_payload = {
                    "id": webhook_id,  # For idempotency
                    "tenant_id": tenant_id,
                    "status": "active",
                    "plan": activate_req.plan,
                    "features": {},  # TODO: Get from plan configuration
                    "limits": {"products": 1000}  # TODO: Get from plan configuration
                }
                
                logger.info(
                    f"Sending license.updated webhook to {webhook_url}",
                    extra={
                        "tenant_id": tenant_id,
                        "module_id": activate_req.module,
                        "webhook_id": webhook_id
                    }
                )
                
                try:
                    webhook_response = await http_request_with_retry(
                        client,
                        "POST",
                        webhook_url,
                        max_attempts=3,
                        base_delay=1.0,
                        max_delay=10.0,
                        enabled=retry_enabled,
                        json=webhook_payload
                    )
                    
                    if not webhook_response.is_success:
                        logger.warning(
                            f"License webhook failed: {webhook_response.text}",
                            extra={
                                "tenant_id": tenant_id,
                                "module_id": activate_req.module,
                                "webhook_id": webhook_id,
                                "status_code": webhook_response.status_code
                            }
                        )
                    else:
                        logger.info(
                            f"License webhook sent successfully",
                            extra={
                                "tenant_id": tenant_id,
                                "module_id": activate_req.module,
                                "webhook_id": webhook_id
                            }
                        )
                except httpx.RequestError as e:
                    logger.warning(
                        f"Failed to send license webhook: {e}",
                        extra={
                            "tenant_id": tenant_id,
                            "module_id": activate_req.module,
                            "webhook_id": webhook_id
                        },
                        exc_info=True
                    )
                    # Don't fail activation if webhook fails
        except Exception as e:
            logger.error(
                f"Unexpected error sending webhook: {e}",
                exc_info=True,
                extra={"tenant_id": tenant_id, "module_id": activate_req.module}
            )
            # Don't fail activation if webhook fails
        
        return {
            "status": "activated",
            "module": activate_req.module,
            "plan": activate_req.plan,
            "tenant_id": tenant_id,
            "subdomain": subdomain
        }
        
    except HTTPException:
        raise
    except (ValueError, IntegrityError, DatabaseError) as e:
        logger.error(
            f"Failed to activate module: {e}",
            exc_info=True,
            extra={"tenant_id": tenant_id, "module_id": activate_req.module}
        )
        raise HTTPException(status_code=500, detail="Failed to activate module")
    except Exception as e:
        logger.error(
            f"Unexpected error during module activation: {e}",
            exc_info=True,
            extra={"tenant_id": tenant_id, "module_id": activate_req.module}
        )
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/switch")
async def switch_module(request: Request):
    """Switch active module for tenant"""
    from pydantic import BaseModel
    
    class SwitchModuleRequest(BaseModel):
        module_id: str
    
    tenant_id = getattr(request.state, "tenant_id", None)
    if not tenant_id:
        raise HTTPException(status_code=401, detail="No tenant found")
    
    # Parse request body
    body = await request.json()
    switch_req = SwitchModuleRequest(**body)
    
    # Check if module exists and is registered
    from app.modules.registry import is_module_registered
    if not is_module_registered(switch_req.module_id):
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Check dependencies
    from app.modules.sdk import check_dependencies
    deps = await check_dependencies(switch_req.module_id)
    if not deps.get("ok"):
        raise HTTPException(
            status_code=400,
            detail=f"Module dependencies not met: {deps.get('missing')} {deps.get('inactive')}"
        )
    
    # Update tenant active module
    from sqlalchemy import select
    from app.models.tenant import Tenant
    from app.db.session import AsyncSessionLocal
    import logging
    
    logger = logging.getLogger(__name__)
    
    async with AsyncSessionLocal() as db:
        try:
            # Get current active module with lock (prevents race condition)
            tenant_stmt = select(Tenant).where(Tenant.id == tenant_id).with_for_update()
            tenant_result = await db.execute(tenant_stmt)
            tenant = tenant_result.scalar_one_or_none()
            
            if not tenant:
                raise HTTPException(status_code=404, detail="Tenant not found")
            
            current_module = tenant.active_module
            
            # TODO: Save current module theme before switching
            
            # Update active module
            tenant.active_module = switch_req.module_id
            
            await db.commit()
            
            logger.info(
                f"Switched module for tenant {tenant_id}: {current_module} -> {switch_req.module_id}",
                extra={"tenant_id": str(tenant_id), "old_module": current_module, "new_module": switch_req.module_id}
            )
        except HTTPException:
            await db.rollback()
            raise
        except Exception as e:
            await db.rollback()
            logger.error(
                f"Failed to switch module: {e}",
                exc_info=True,
                extra={"tenant_id": str(tenant_id), "module_id": switch_req.module_id}
            )
            raise HTTPException(status_code=500, detail="Failed to switch module")
    
    # TODO: Notify old module of deactivation
    # TODO: Notify new module of activation
    
    return {
        "success": True,
        "active_module": switch_req.module_id,
        "previous_module": current_module
    }
