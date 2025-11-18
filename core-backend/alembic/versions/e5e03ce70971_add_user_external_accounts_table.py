"""add_user_external_accounts_table

Revision ID: e5e03ce70971
Revises: ca5d2b0eba52
Create Date: 2025-11-18 04:12:00.802348

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'e5e03ce70971'
down_revision = 'ca5d2b0eba52'
branch_labels = None
depends_on = None


def table_exists(table_name: str) -> bool:
    """Check if table exists in database"""
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    return table_name in inspector.get_table_names()


def upgrade() -> None:
    # Create user_external_accounts table for OAuth providers
    if not table_exists('user_external_accounts'):
        op.create_table('user_external_accounts',
            sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
            sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column('provider', sa.String(length=50), nullable=False),
            sa.Column('external_id', sa.String(length=255), nullable=False),
            sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('provider', 'external_id', name='uq_provider_external_id')
        )
        op.create_index('idx_user_external_accounts_user_id', 'user_external_accounts', ['user_id'], unique=False)
        op.create_index('idx_user_external_accounts_provider_external_id', 'user_external_accounts', ['provider', 'external_id'], unique=True)


def downgrade() -> None:
    # Drop user_external_accounts table
    if table_exists('user_external_accounts'):
        op.drop_index('idx_user_external_accounts_provider_external_id', table_name='user_external_accounts')
        op.drop_index('idx_user_external_accounts_user_id', table_name='user_external_accounts')
        op.drop_table('user_external_accounts')

