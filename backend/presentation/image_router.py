from fastapi import APIRouter, HTTPException

from application.generate_image import GenerateImageUseCase
from domain.exceptions import DomainError
from presentation.schemas import ImageRequest, ImageResponse


def create_image_router(use_case: GenerateImageUseCase) -> APIRouter:
    router = APIRouter(prefix="/api/image", tags=["image"])

    @router.post("/generate", response_model=ImageResponse)
    async def generate_image(request: ImageRequest) -> ImageResponse:
        try:
            result = await use_case.execute(request.headline)
            return ImageResponse(
                image_url=result.image_url,
                prompt_used=result.prompt_used,
            )
        except DomainError as e:
            raise HTTPException(status_code=502, detail=str(e))

    return router
