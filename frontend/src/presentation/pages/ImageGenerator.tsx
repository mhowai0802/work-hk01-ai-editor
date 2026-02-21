import { useMemo } from "react";
import { useImageGenerator } from "../../application/useImageGenerator";
import { ImageRepository } from "../../infrastructure/imageRepository";

export function ImageGeneratorPage() {
  const repo = useMemo(() => new ImageRepository(), []);
  const { headline, setHeadline, result, loading, error, generate, reset } =
    useImageGenerator(repo);

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.imageUrl;
    link.target = "_blank";
    link.download = "hk01-generated-image.jpg";
    link.click();
  };

  return (
    <div className="page-container">
      <h1 className="page-title">新聞配圖</h1>
      <p className="page-subtitle">
        輸入中文新聞標題，AI 將自動生成一張配圖
      </p>

      <div className="input-area">
        <input
          type="text"
          placeholder="請輸入新聞標題..."
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          disabled={loading}
          maxLength={200}
          onKeyDown={(e) => e.key === "Enter" && generate()}
        />
      </div>

      <div className="btn-row">
        <button
          className="btn-primary"
          onClick={generate}
          disabled={loading || !headline.trim()}
        >
          {loading ? "生成中..." : "生成配圖"}
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

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <div className="loading-text">正在生成圖片，請稍候...</div>
        </div>
      )}

      {result && !loading && (
        <div className="result-section">
          <div className="result-label">生成的配圖</div>
          <div className="image-result">
            <img src={result.imageUrl} alt="Generated news image" />
            <div className="image-result-footer">
              <span className="image-prompt-text">
                Prompt: {result.promptUsed}
              </span>
              <button className="btn-download" onClick={handleDownload}>
                下載
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
