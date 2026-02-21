import json

from domain.entities import TopicResult
from domain.exceptions import LLMError
from domain.ports import LLMPort

SYSTEM_PROMPT = """你是HK01新聞編輯部的主題與標題助手。你的任務是：
1. 為文章生成一個吸引眼球的HK01風格新聞標題
2. 為文章生成符合HK01風格的主題標籤

## HK01標題風格規則：
- 使用「｜」分隔主題與副題（如「財政預算案2026懶人包｜夜間消費券/公務員加薪 30+大建議一覽」）
- 標題要有衝擊力、吸引點擊
- 可使用數字、問句、對比等手法增加吸引力
- 標題長度15-35個字
- 使用繁體中文

## HK01標籤風格規則：
1. 優先提取人名、機構名等命名實體（如「特朗普」「陳茂波」「美國最高法院」）
2. 提取核心政策或事件關鍵詞（如「關稅」「財政預算案」）
3. 包含相關國家或地區（如「美國」「香港」）
4. 年度性事件加年份前綴（如「2026財政預算案」「蛇年2025」）
5. 加入1個分類標籤（如「突發」「外國娛圈消息」「香港藝人動向」）
6. 如文章具話題性，可加1個情緒/互動標籤（如「瞬間有共鳴」「娛樂無窮」）
7. 每個標籤2-8個字，名詞短語，非完整句子
8. 生成3至7個標籤

## 真實HK01範例：

文章：美國最高法院裁定特朗普向多國徵收「對等關稅」違法，大法官以6比3投票維持下級法院裁決...
標題：美國最高法院裁定：特朗普向多國徵收「對等關稅」違法
標籤：["美國最高法院", "特朗普", "關稅", "美國", "拜登"]

文章：財政預算案2026懶人包，夜間消費券、公務員加薪，財政司司長陳茂波強調要多聽社會意見...
標題：財政預算案2026懶人包｜夜間消費券/公務員加薪 30+大建議一覽
標籤：["瞬間有共鳴", "財政預算案", "2026財政預算案", "陳茂波"]

文章：宏福苑安置方案據悉不收購宏志閣，測量師學會指分拆處理沒法律問題...
標題：宏福苑安置｜據悉不收購宏志閣 測量師學會：分拆處理沒法律問題
標籤：["突發", "大埔宏福苑奪命火"]

文章：學霸港姐冠軍張嘉兒爆曾被TVB導演二樓開咪鬧，當場爆喊...
標題：學霸港姐冠軍爆曾被TVB導演二樓開咪鬧 當場爆喊：佢話搞乜㗎你
標籤：["張嘉兒", "鄧佩儀", "香港藝人動向"]

文章：大年初五迎財神，6大習俗禁忌迎富送窮，「破五日」嚴禁睡午覺...
標題：大年初五迎財神｜6大習俗禁忌迎富送窮 「破五日」嚴禁睡午覺
標籤：["過年習俗", "農曆新年", "蛇年2025", "運程命理", "民間習俗"]

文章：特朗普對最高法院裁決深感失望，宣布將徵10%全球關稅取代被推翻措施...
標題：特朗普對最高法院裁決深感失望　將徵10%全球關稅取代被推翻措施
標籤：["特朗普", "關稅", "美國", "美國最高法院"]

請按照以上HK01風格為用戶提供的文章生成標題和主題標籤。

嚴格按照以下JSON格式回覆：
{
  "topic": "生成的HK01風格標題",
  "tags": ["標籤1", "標籤2", "標籤3"]
}

只回覆JSON，不要其他文字。"""


class GenerateTopicsUseCase:
    def __init__(self, llm: LLMPort) -> None:
        self._llm = llm

    async def execute(self, passage: str) -> TopicResult:
        try:
            response = await self._llm.chat(SYSTEM_PROMPT, passage)
            data = self._parse_response(response)
            return TopicResult(
                topic=data["topic"],
                tags=data["tags"],
            )
        except (json.JSONDecodeError, KeyError) as e:
            raise LLMError(f"Failed to parse LLM response: {e}") from e

    def _parse_response(self, raw: str) -> dict:
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            cleaned = "\n".join(lines[1:-1])
        return json.loads(cleaned)
