import { useMemo } from "react";
import { useTopicGenerator } from "../../application/useTopicGenerator";
import { TopicRepository } from "../../infrastructure/topicRepository";

export function TopicGeneratorPage() {
  const repo = useMemo(() => new TopicRepository(), []);
  const { passage, setPassage, result, loading, error, generate, reset } =
    useTopicGenerator(repo);

  return (
    <div className="page-container">
      <h1 className="page-title">主題生成</h1>
      <p className="page-subtitle">
        貼上一段中文新聞文章，AI 將自動提取關鍵主題
      </p>

      <div className="input-area">
        <textarea
          placeholder="請在此貼上文章段落（至少10個字）..."
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
          onClick={generate}
          disabled={loading || !passage.trim()}
        >
          {loading ? "生成中..." : "生成主題"}
        </button>
        <button
          className="btn-secondary"
          onClick={reset}
          disabled={loading}
        >
          清除
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span className="dot" />
          {error}
        </div>
      )}

      {result && (
        <div className="result-section">
          <div className="result-label">提取的主題</div>
          <div className="topic-list">
            {result.topics.map((topic) => (
              <span key={topic} className="topic-tag">{topic}</span>
            ))}
          </div>
          <p className="summary-text">
            <strong>摘要 — </strong>
            {result.passageSummary}
          </p>
        </div>
      )}
    </div>
  );
}
