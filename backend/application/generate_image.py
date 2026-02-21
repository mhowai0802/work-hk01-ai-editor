from domain.entities import ImageResult
from domain.exceptions import ImageGenerationError, LLMError
from domain.ports import ImageGeneratorPort, LLMPort

TRANSLATE_PROMPT = """You are a prompt engineer for image generation AI.
The user will give you a Chinese news headline. Your job is to convert it into
a concise, vivid English image prompt suitable for an AI image generator.

Rules:
- Output ONLY the English image prompt, nothing else
- Make it descriptive and visual (colors, composition, mood)
- Keep it under 80 words
- Style: photojournalism, high quality, editorial photo"""


class GenerateImageUseCase:
    def __init__(self, llm: LLMPort, image_gen: ImageGeneratorPort) -> None:
        self._llm = llm
        self._image_gen = image_gen

    async def execute(self, headline: str) -> ImageResult:
        english_prompt = await self._translate_to_prompt(headline)
        try:
            image_url = await self._image_gen.generate(
                prompt=english_prompt,
                width=1024,
                height=768,
            )
        except Exception as e:
            raise ImageGenerationError(f"Image generation failed: {e}") from e

        return ImageResult(image_url=image_url, prompt_used=english_prompt)

    async def _translate_to_prompt(self, headline: str) -> str:
        try:
            return await self._llm.chat(TRANSLATE_PROMPT, headline)
        except Exception as e:
            raise LLMError(f"Failed to translate headline: {e}") from e
