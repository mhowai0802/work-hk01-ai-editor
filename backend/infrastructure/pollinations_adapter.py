import asyncio

import httpx

from domain.exceptions import ImageGenerationError
from domain.ports import ImageGeneratorPort

MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 2


class PollinationsAdapter(ImageGeneratorPort):
    """Uses api.airforce free image generation API (OpenAI-compatible)."""

    API_URL = "https://api.airforce/v1/images/generations"
    MODEL = "flux-2-klein-4b"

    async def generate(self, prompt: str, width: int = 1024, height: int = 768) -> str:
        payload = {
            "model": self.MODEL,
            "prompt": prompt,
            "size": f"{width}x{height}",
            "n": 1,
        }

        last_error: Exception | None = None
        for attempt in range(MAX_RETRIES):
            try:
                async with httpx.AsyncClient(timeout=180.0) as client:
                    response = await client.post(self.API_URL, json=payload)
                    response.raise_for_status()
                    data = response.json()
                    images = data.get("data", [])
                    if images and images[0].get("url"):
                        return images[0]["url"]
                    last_error = ImageGenerationError(
                        f"API returned empty image list (attempt {attempt + 1}/{MAX_RETRIES})"
                    )
            except httpx.HTTPStatusError as e:
                last_error = ImageGenerationError(
                    f"Image API returned {e.response.status_code}: {e.response.text[:200]}"
                )
            except httpx.RequestError as e:
                last_error = ImageGenerationError(f"Request failed: {e}")

            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(RETRY_DELAY_SECONDS)

        raise last_error or ImageGenerationError("Image generation failed after retries")
