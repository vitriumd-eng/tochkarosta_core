"""
Platform Content Service - Content management for landing page
Uses SQLAlchemy ORM for all database operations
"""
from typing import Optional, Dict, Any
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.models.platform_content import PlatformContent
from app.db.session import AsyncSessionLocal
import uuid
import logging

logger = logging.getLogger(__name__)


class PlatformContentService:
    """Platform content management service"""
    
    async def get_all_content(self) -> Dict[str, Dict[str, Any]]:
        """Get all platform content sections"""
        async with AsyncSessionLocal() as db:
            stmt = select(PlatformContent)
            result = await db.execute(stmt)
            contents = result.scalars().all()
            
            content_dict = {}
            for content in contents:
                content_dict[content.key] = {
                    "content": content.content,
                    "updated_at": content.updated_at.isoformat() if content.updated_at else None,
                    "updated_by": str(content.updated_by) if content.updated_by else None
                }
            
            return content_dict
    
    async def get_content_by_key(self, key: str) -> Optional[PlatformContent]:
        """Get content by key"""
        async with AsyncSessionLocal() as db:
            stmt = select(PlatformContent).where(PlatformContent.key == key)
            result = await db.execute(stmt)
            content = result.scalar_one_or_none()
            
            return content
    
    async def upsert_content(
        self,
        key: str,
        content: Dict[str, Any],
        updated_by: uuid.UUID
    ) -> PlatformContent:
        """Create or update content section"""
        async with AsyncSessionLocal() as db:
            # Check if content exists
            stmt = select(PlatformContent).where(PlatformContent.key == key)
            result = await db.execute(stmt)
            existing = result.scalar_one_or_none()
            
            if existing:
                # Update existing
                existing.content = content
                existing.updated_by = updated_by
                existing.updated_at = datetime.utcnow()
                await db.flush()
                await db.commit()
                await db.refresh(existing)
                logger.info(f"Updated platform content: {key}")
                return existing
            else:
                # Insert new
                new_content = PlatformContent(
                    key=key,
                    content=content,
                    updated_by=updated_by
                )
                db.add(new_content)
                try:
                    await db.flush()
                    await db.commit()
                    await db.refresh(new_content)
                    logger.info(f"Created platform content: {key}")
                    return new_content
                except IntegrityError as e:
                    await db.rollback()
                    raise ValueError(f"Failed to upsert content for key: {key}: {e}") from e

