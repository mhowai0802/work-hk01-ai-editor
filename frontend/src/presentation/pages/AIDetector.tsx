import { useMemo } from "react";
import { useAIDetector } from "../../application/useAIDetector";
import { DetectRepository } from "../../infrastructure/detectRepository";

function confidenceLabel(confidence: string): string {
  switch (confidence) {
    case "high":
      return "高";
    case "medium":
      return "中";
    case "low":
      return "低";
    default:
      return confidence;
  }
}

export function AIDetectorPage() {
  const repo = useMemo(() => new DetectRepository(), []);
  const { passage, setPassage, result, loading, error, detect, reset } =
    useAIDetector(repo);

  const pct = result ? Math.round(result.aiProbability * 100) : 0;

  return (
    <div className="page-container">
      <h1 className="page-title">AI 內容檢測</h1>
      <p className="page-subtitle">
        檢測文章是否由 AI 生成，避免 Google SEO 懲罰
      </p>

      <div className="input-area">
        <textarea
          placeholder="請在此貼上需要檢測的文章段落（至少10個字）..."
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
          disabled={loading}
          maxLength={5000}
        />
        <div className="char-count">{passage.length} / 5000</div>
      </div>

      <div className="btn-row">
        <button
          className="btn-primary"
          onClick={detect}
          disabled={loading || !passage.trim()}
        >
          {loading ? "檢測中..." : "開始檢測"}
        </button>
        <button className="btn-secondary" onClick={reset} disabled={loading}>
          清除
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span className="dot" />
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <div className="loading-text">正在分析文章，請稍候...</div>
        </div>
      )}

      {result && !loading && (
        <div className="result-section">
          <div className="result-label">檢測結果</div>

          {/* Verdict */}
          <div className="detect-verdict">
            <span className={`verdict-badge ${result.isAiGenerated ? "ai" : "human"}`}>
              {result.isAiGenerated ? "疑似 AI 生成" : "疑似人工撰寫"}
            </span>
            <span className="verdict-confidence">
              可信度：{confidenceLabel(result.confidence)}
            </span>
          </div>

          {/* Probability meter */}
          <div className="meter-container">
            <div className="meter-header">
              <span>AI 生成概率</span>
              <span className="meter-value">{pct}%</span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="meter-labels">
              <span>人工撰寫</span>
              <span>AI 生成</span>
            </div>
          </div>

          {/* Reasons */}
          <div className="detect-reasons">
            <div className="result-label">分析理由</div>
            <ul className="reasons-list">
              {result.reasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>

          {/* Suggestion */}
          <div className="detect-suggestion">
            <div className="result-label">編輯建議</div>
            <p className="suggestion-text">{result.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
