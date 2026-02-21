class DomainError(Exception):
    """Base exception for domain errors."""


class LLMError(DomainError):
    """Raised when the LLM service fails."""


class ImageGenerationError(DomainError):
    """Raised when image generation fails."""


class InvalidInputError(DomainError):
    """Raised when user input is invalid."""
