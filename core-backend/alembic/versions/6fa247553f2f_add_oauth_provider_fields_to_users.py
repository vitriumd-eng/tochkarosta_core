"""add_oauth_provider_fields_to_users

Revision ID: 6fa247553f2f
Revises: e5e03ce70971
Create Date: 2025-11-18 04:58:25.541804

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '6fa247553f2f'
down_revision = 'e5e03ce70971'
branch_labels = None
depends_on = None


def column_exists(table_name: str, column_name: str) -> bool:
    """Check if column exists in table"""
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns


def upgrade() -> None:
    # Add OAuth provider fields to users table
    if not column_exists('users', 'auth_provider'):
        op.add_column('users', sa.Column('auth_provider', sa.String(length=20), nullable=True))
    
    if not column_exists('users', 'tg_user_id'):
        op.add_column('users', sa.Column('tg_user_id', sa.String(length=255), nullable=True))
    
    if not column_exists('users', 'max_user_id'):
        op.add_column('users', sa.Column('max_user_id', sa.String(length=255), nullable=True))
    
    if not column_exists('users', 'vk_id'):
        op.add_column('users', sa.Column('vk_id', sa.String(length=255), nullable=True))
    
    # Make phone nullable (for VK OAuth users who may not have phone)
    # Check current constraint first
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    columns = inspector.get_columns('users')
    phone_col = next((col for col in columns if col['name'] == 'phone'), None)
    if phone_col and not phone_col['nullable']:
        op.alter_column('users', 'phone', nullable=True)


def downgrade() -> None:
    # Remove OAuth provider fields
    if column_exists('users', 'auth_provider'):
        op.drop_column('users', 'auth_provider')
    
    if column_exists('users', 'tg_user_id'):
        op.drop_column('users', 'tg_user_id')
    
    if column_exists('users', 'max_user_id'):
        op.drop_column('users', 'max_user_id')
    
    if column_exists('users', 'vk_id'):
        op.drop_column('users', 'vk_id')
    
    # Restore phone NOT NULL (if needed)
    # Note: This may fail if there are NULL phones, handle with care
    op.alter_column('users', 'phone', nullable=False)

