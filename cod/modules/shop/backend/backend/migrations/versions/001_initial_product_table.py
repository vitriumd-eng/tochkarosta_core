"""Initial product table

Revision ID: 001
Revises: 
Create Date: 2025-11-16 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create products table for shop module
    op.create_table(
        'products',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('tenant_id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('stock', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('sku', sa.String(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('active', sa.Boolean(), nullable=True, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index('idx_products_tenant_id', 'products', ['tenant_id'])
    op.create_index('idx_products_sku', 'products', ['sku'], unique=True)
    op.create_index('idx_products_active', 'products', ['active'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('idx_products_active', table_name='products')
    op.drop_index('idx_products_sku', table_name='products')
    op.drop_index('idx_products_tenant_id', table_name='products')
    
    # Drop table
    op.drop_table('products')

