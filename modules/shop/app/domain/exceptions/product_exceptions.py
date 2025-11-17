"""
Product Domain Exceptions
"""


class ProductNotFoundError(Exception):
    """Product not found"""
    pass


class ProductValidationError(Exception):
    """Product validation failed"""
    pass


class ProductOutOfStockError(Exception):
    """Product is out of stock"""
    pass



