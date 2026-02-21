from fastapi import APIRouter

from infrastructure.hkbu_qwen_adapter import HKBUQwenAdapter
from presentation.schemas import ConfigResponse, ConfigUpdateRequest


def _mask_key(key: str) -> str:
    if len(key) <= 8:
        return "*" * len(key)
    return key[:4] + "*" * (len(key) - 8) + key[-4:]


def create_config_router(llm_adapter: HKBUQwenAdapter) -> APIRouter:
    router = APIRouter(prefix="/api/config", tags=["config"])

    @router.get("", response_model=ConfigResponse)
    async def get_config() -> ConfigResponse:
        return ConfigResponse(
            api_key_masked=_mask_key(llm_adapter.api_key),
            base_url=llm_adapter._base_url,
            model=llm_adapter._model,
            api_version=llm_adapter._api_version,
        )

    @router.put("/api-key")
    async def update_api_key(request: ConfigUpdateRequest):
        llm_adapter.api_key = request.api_key
        return {
            "status": "ok",
            "api_key_masked": _mask_key(llm_adapter.api_key),
        }

    return router
