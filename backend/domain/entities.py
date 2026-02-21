from dataclasses import dataclass


@dataclass(frozen=True)
class TopicResult:
    topics: list[str]
    passage_summary: str


@dataclass(frozen=True)
class ImageResult:
    image_url: str
    prompt_used: str


@dataclass(frozen=True)
class AIDetectionResult:
    is_ai_generated: bool
    ai_probability: float
    confidence: str
    reasons: list[str]
    suggestion: str
