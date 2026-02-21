import json

import httpx

from domain.exceptions import LLMError
from domain.ports import LLMPort


class HKBUQwenAdapter(LLMPort):
    def __init__(
        self,
        api_key: str,
        base_url: str = "https://genai.hkbu.edu.hk/api/v0/rest",
        model: str = "qwen-plus",
        api_version: str = "v1",
    ) -> None:
        self._api_key = api_key
        self._base_url = base_url
        self._model = model
        self._api_version = api_version

    def _build_url(self) -> str:
        return (
            f"{self._base_url}/deployments/{self._model}"
            f"/chat/completions?api-version={self._api_version}"
        )

    def _build_headers(self) -> dict[str, str]:
        return {
            "accept": "application/json",
            "Content-Type": "application/json",
            "api-key": self._api_key,
        }

    async def chat(self, system_prompt: str, user_message: str) -> str:
        payload = {
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            "temperature": 0.7,
            "max_tokens": 1000,
            "top_p": 1,
            "stream": False,
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    self._build_url(),
                    json=payload,
                    headers=self._build_headers(),
                )
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except httpx.HTTPStatusError as e:
            raise LLMError(
                f"HKBU API returned {e.response.status_code}: {e.response.text}"
            ) from e
        except (httpx.RequestError, KeyError, IndexError) as e:
            raise LLMError(f"HKBU API request failed: {e}") from e

    async def chat_json(self, system_prompt: str, user_message: str) -> dict:
        raw = await self.chat(system_prompt, user_message)
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            cleaned = "\n".join(lines[1:-1])
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            raise LLMError(f"Failed to parse JSON from LLM: {e}") from e
