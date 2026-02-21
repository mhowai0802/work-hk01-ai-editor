import json

from domain.entities import AIDetectionResult
from domain.exceptions import LLMError
from domain.ports import LLMPort

SYSTEM_PROMPT = """你是一位專業的AI內容檢測專家，擅長分辨文章是否由AI生成。

請仔細分析用戶提供的文章段落，從以下角度判斷：
1. 句式結構是否過於工整、重複
2. 是否缺乏個人觀點、情感或獨特表達
3. 過渡句是否生硬或過於模板化
4. 用詞是否過於正式或缺乏口語化表達
5. 是否存在AI常見的列舉、總結模式
6. 內容是否過於面面俱到而缺乏深度

請嚴格按照以下JSON格式回覆：
{
  "is_ai_generated": true或false,
  "ai_probability": 0.0到1.0之間的數值,
  "confidence": "high"或"medium"或"low",
  "reasons": ["分析原因1", "分析原因2", "分析原因3"],
  "suggestion": "給編輯的具體建議"
}

要求：
- reasons提供3到5條具體分析理由
- suggestion用中文給出實際可操作的編輯建議
- 只回覆JSON，不要其他文字"""


class DetectAIContentUseCase:
    def __init__(self, llm: LLMPort) -> None:
        self._llm = llm

    async def execute(self, passage: str) -> AIDetectionResult:
        try:
            response = await self._llm.chat(SYSTEM_PROMPT, passage)
            data = self._parse_response(response)
            return AIDetectionResult(
                is_ai_generated=bool(data["is_ai_generated"]),
                ai_probability=float(data["ai_probability"]),
                confidence=str(data["confidence"]),
                reasons=list(data["reasons"]),
                suggestion=str(data["suggestion"]),
            )
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            raise LLMError(f"Failed to parse AI detection response: {e}") from e

    def _parse_response(self, raw: str) -> dict:
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            cleaned = "\n".join(lines[1:-1])
        return json.loads(cleaned)
