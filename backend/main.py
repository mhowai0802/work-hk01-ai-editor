import os
import sys

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sys.path.insert(0, os.path.dirname(__file__))

load_dotenv()

from application.detect_ai_content import DetectAIContentUseCase
from application.generate_image import GenerateImageUseCase
from application.generate_topics import GenerateTopicsUseCase
from infrastructure.hkbu_qwen_adapter import HKBUQwenAdapter
from infrastructure.pollinations_adapter import PollinationsAdapter
from presentation.detect_router import create_detect_router
from presentation.image_router import create_image_router
from presentation.topic_router import create_topic_router

api_key = os.getenv("HKBU_API_KEY", "")
base_url = os.getenv("HKBU_BASE_URL", "https://genai.hkbu.edu.hk/api/v0/rest")
model = os.getenv("LLM_MODEL", "qwen-plus")
api_version = os.getenv("LLM_API_VERSION", "v1")

llm_adapter = HKBUQwenAdapter(
    api_key=api_key,
    base_url=base_url,
    model=model,
    api_version=api_version,
)
image_adapter = PollinationsAdapter()

topic_use_case = GenerateTopicsUseCase(llm=llm_adapter)
image_use_case = GenerateImageUseCase(llm=llm_adapter, image_gen=image_adapter)
detect_use_case = DetectAIContentUseCase(llm=llm_adapter)

app = FastAPI(
    title="HK01 AI Editor",
    description="AI-powered topic extraction and news image generation",
    version="1.0.0",
)

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(create_topic_router(topic_use_case))
app.include_router(create_image_router(image_use_case))
app.include_router(create_detect_router(detect_use_case))


@app.get("/health")
async def health_check():
    return {"status": "ok"}
