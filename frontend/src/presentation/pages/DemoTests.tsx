import { useState } from "react";

interface TestCase {
  label: string;
  category: string;
  text: string;
}

const TOPIC_TESTS: TestCase[] = [
  {
    label: "國際政治",
    category: "即時國際",
    text: "美國最高法院2月20日裁定，推翻特朗普第二任總統任期推出的關稅政策。最高法院的大法官們以6比3的投票結果，維持下級法院的裁決，即特朗普引用1977年通過的《國際緊急經濟權力法》開徵關稅超越其權限。特朗普其後開記者會宣布，他同日較後時間簽署一項命令，引用1974年貿易法第122條對全球商品加徵10%的關稅，即時取代被最高法院推翻的關稅措施。據路透社報道，特朗普在記者會上表示，最高法院推翻其全面關稅政策的裁決「令人深感失望」，他對以6比3的投票結果做出不利於他的裁決的法官們感到「無比羞愧」。",
  },
  {
    label: "本地社會",
    category: "社會新聞",
    text: "有指政府最快明日公布宏福苑的安置方案，據報政府選擇收購業權，不作原址重建。未受大火波及的宏志閣則會分拆處理，預計政府不會收購業權，但業主可考慮政府提出「樓換樓」等方案。測量師學會會長溫偉明指，原址重建需要集齊整個屋苑業權，若政府放棄重建便可以只收購其中七幢大廈，做法亦沒有法律問題。有宏志閣居民接受有關方案，樂意重返宏志閣居住，並提議政府容許「業權交換」，讓有意留在原址的其餘七廈居民，可與不願留下的宏志閣業主交換物業。",
  },
  {
    label: "財經政策",
    category: "開罐",
    text: "《財政預算案2026》將於2月25日正式公布，現已正式展開公眾諮詢。早前財政司司長陳茂波強調要多聽社會各界意見，積極開拓經濟增長點。各大會計師行、商會及議員紛紛出謀獻策，涵蓋派糖、稅務寬減、樓市股市及長者福利等多個範疇。立法會議員吳傑莊建議推出限定晚上9時後使用的「夜間電子消費券」，期望精準刺激晚市餐飲、酒吧及戲院等行業，以推動夜經濟發展。特許公認會計師公會建議將薪俸稅一次性寬減上限由1,500元調升至10,000元。",
  },
];

const IMAGE_TESTS: TestCase[] = [
  {
    label: "經濟新聞",
    category: "即時港聞",
    text: "香港推出新一輪消費券計劃刺激經濟",
  },
  {
    label: "國際政治",
    category: "即時國際",
    text: "特朗普對最高法院裁決深感失望　將徵10%全球關稅取代被推翻措施",
  },
  {
    label: "本地突發",
    category: "社會新聞",
    text: "大埔宏福苑大火安置方案出爐　政府擬收購七廈業權",
  },
  {
    label: "天氣新聞",
    category: "即時港聞",
    text: "天文台料下周氣溫驟降至12度　市民宜添衣保暖",
  },
];

const DETECT_TESTS: TestCase[] = [
  {
    label: "真人撰寫 (HK01記者)",
    category: "預期：低 AI 概率",
    text: "一直希望原址重建的宏志閣居民戴先生接受上述方案，直言：「OK嘅，唔收就唔收。」他表示樂意重返宏志閣居住，惟擔心當局在收購其餘7座業權後，隨時又想收回宏志閣。他希望政府切實及盡快讓宏志閣居民搬回住所，因為現時宏志閣居民流離浪蕩，居無定所。此外，戴先生提出「業權交換」的構思，若宏志閣有部分居民不願留下，而其他座數的居民有強烈意願留在原址，他建議政府容許雙方交換業權，以滿足不同居民的住屋需求。至於聯署要求原址重建的居民，戴先生指他們態度堅定，至今未見有人想「轉軚」。",
  },
  {
    label: "AI 生成文章",
    category: "預期：高 AI 概率",
    text: "人工智能技術的發展對社會產生了深遠的影響。首先，它提高了生產效率，使許多行業實現了自動化。其次，AI在醫療領域的應用為疾病診斷提供了新的可能性。此外，智能交通系統的發展也大幅改善了城市的交通狀況。然而，我們也需要關注AI帶來的倫理問題和就業影響。總的來說，人工智能是一把雙刃劍，需要我們審慎對待。",
  },
  {
    label: "混合內容",
    category: "預期：中等 AI 概率",
    text: "據路透社報道，特朗普在記者會上表示，最高法院推翻其全面關稅政策的裁決「令人深感失望」。分析指出，關稅政策對全球貿易體系產生了重大影響。一方面，它保護了本國產業；另一方面，它也引發了貿易夥伴的強烈反彈。經濟學家普遍認為，關稅戰最終會導致消費者承擔更高的成本，而企業也需要重新調整供應鏈布局。",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      className={`btn-copy ${copied ? "copied" : ""}`}
      onClick={handleCopy}
    >
      {copied ? "已複製" : "複製"}
    </button>
  );
}

function TestSection({ title, description, tests }: { title: string; description: string; tests: TestCase[] }) {
  return (
    <section className="arch-section">
      <h2 className="arch-heading">{title}</h2>
      <p className="arch-text">{description}</p>
      <div className="test-cards">
        {tests.map((t, i) => (
          <div key={i} className="test-card">
            <div className="test-card-header">
              <span className="test-card-label">{t.label}</span>
              <span className="test-card-category">{t.category}</span>
              <CopyButton text={t.text} />
            </div>
            <p className="test-card-text">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DemoTestsPage() {
  return (
    <div className="page-container">
      <h1 className="page-title">Demo 測試素材</h1>
      <p className="page-subtitle">
        真實 HK01 新聞素材，點擊「複製」後貼到對應功能頁面測試
      </p>

      <TestSection
        title="主題生成測試"
        description="複製以下文章段落，貼到「主題生成」頁面，測試 AI 生成 HK01 風格標題和標籤。"
        tests={TOPIC_TESTS}
      />

      <TestSection
        title="新聞配圖測試"
        description="複製以下新聞標題，貼到「新聞配圖」頁面，測試 AI 生成配圖。"
        tests={IMAGE_TESTS}
      />

      <TestSection
        title="AI 檢測測試"
        description="複製以下段落，貼到「AI 檢測」頁面。對比真人撰寫 vs AI 生成的檢測結果差異。"
        tests={DETECT_TESTS}
      />

      <section className="arch-section">
        <h2 className="arch-heading">建議 Demo 流程</h2>
        <div className="arch-flow">
          <div className="flow-step">
            <span className="flow-num">1</span>
            <div>
              <strong>主題生成</strong>
              <p>貼上「國際政治」文章，展示生成 HK01 風格標題 + 標籤</p>
            </div>
          </div>
          <div className="flow-step">
            <span className="flow-num">2</span>
            <div>
              <strong>新聞配圖</strong>
              <p>複製生成的標題到配圖頁面，展示從標題到圖片的完整流程</p>
            </div>
          </div>
          <div className="flow-step">
            <span className="flow-num">3</span>
            <div>
              <strong>AI 檢測對比</strong>
              <p>先測「真人撰寫」（低概率），再測「AI 生成」（高概率），展示對比效果</p>
            </div>
          </div>
          <div className="flow-step">
            <span className="flow-num">4</span>
            <div>
              <strong>系統架構</strong>
              <p>切到「系統架構」頁面，用流程圖解釋技術實現</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
