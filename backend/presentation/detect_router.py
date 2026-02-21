from fastapi import APIRouter, HTTPException

from application.detect_ai_content import DetectAIContentUseCase
from domain.exceptions import DomainError
from presentation.schemas import DetectRequest, DetectResponse


def create_detect_router(use_case: DetectAIContentUseCase) -> APIRouter:
    router = APIRouter(prefix="/api/detect", tags=["detect"])

    @router.post("/ai", response_model=DetectResponse)
    async def detect_ai_content(request: DetectRequest) -> DetectResponse:
        try:
            result = await use_case.execute(request.passage)
            return DetectResponse(
                is_ai_generated=result.is_ai_generated,
                ai_probability=result.ai_probability,
                confidence=result.confidence,
                reasons=result.reasons,
                suggestion=result.suggestion,
            )
        except DomainError as e:
            raise HTTPException(status_code=502, detail=str(e))

    return router
