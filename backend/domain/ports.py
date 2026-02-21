from abc import ABC, abstractmethod


class LLMPort(ABC):
    @abstractmethod
    async def chat(self, system_prompt: str, user_message: str) -> str:
        """Send a chat completion request and return the assistant's reply."""

    @abstractmethod
    async def chat_json(self, system_prompt: str, user_message: str) -> dict:
        """Send a chat completion request expecting a JSON response."""


class ImageGeneratorPort(ABC):
    @abstractmethod
    async def generate(self, prompt: str, width: int = 1024, height: int = 768) -> str:
        """Generate an image from a text prompt and return the image URL."""
