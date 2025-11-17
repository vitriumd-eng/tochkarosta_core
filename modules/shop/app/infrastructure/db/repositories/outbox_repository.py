"""
Outbox Repository
Manages outbox table for event sourcing
"""
from typing import List, Optional
from datetime import datetime
from app.infrastructure.db.session import get_db


class OutboxRepository:
    """Repository for outbox table"""
    
    async def create(self, topic: str, payload: dict):
        """Create outbox entry"""
        # TODO: Implement outbox creation
        pass
    
    async def get_unprocessed(self, limit: int = 100) -> List[dict]:
        """Get unprocessed outbox entries"""
        # TODO: Implement query
        return []
    
    async def mark_processed(self, outbox_id: int):
        """Mark outbox entry as processed"""
        # TODO: Implement update
        pass



