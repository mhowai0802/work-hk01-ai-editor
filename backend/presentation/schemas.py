from pydantic import BaseModel, Field


class TopicRequest(BaseModel):
    passage: str = Field(..., min_length=10, description="The Chinese passage to extract topics from")


class TopicResponse(BaseModel):
    topic: str
    tags: list[str]


class ImageRequest(BaseModel):
    headline: str = Field(..., min_length=2, description="The Chinese news headline")


class ImageResponse(BaseModel):
    image_url: str
    prompt_used: str


class DetectRequest(BaseModel):
    passage: str = Field(..., min_length=10, description="The passage to check for AI-generated content")


class DetectResponse(BaseModel):
    is_ai_generated: bool
    ai_probability: float
    confidence: str
    reasons: list[str]
    suggestion: str


class ErrorResponse(BaseModel):
    detail: str
