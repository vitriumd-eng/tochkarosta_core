"""
Database Base - SQLAlchemy declarative base for module models
Module uses its own DB per tenant (via SDK)
"""
from sqlalchemy.orm import declarative_base

Base = declarative_base()

