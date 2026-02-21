from fastapi import APIRouter, HTTPException

from application.generate_topics import GenerateTopicsUseCase
from domain.exceptions import DomainError
from presentation.schemas import TopicRequest, TopicResponse


def create_topic_router(use_case: GenerateTopicsUseCase) -> APIRouter:
    router = APIRouter(prefix="/api/topic", tags=["topic"])

    @router.post("/generate", response_model=TopicResponse)
    async def generate_topics(request: TopicRequest) -> TopicResponse:
        try:
            result = await use_case.execute(request.passage)
            return TopicResponse(
                topics=result.topics,
                passage_summary=result.passage_summary,
            )
        except DomainError as e:
            raise HTTPException(status_code=502, detail=str(e))

    return router
