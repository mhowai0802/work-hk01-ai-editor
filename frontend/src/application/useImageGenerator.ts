import { useCallback, useState } from "react";
import type { IImageRepository } from "../domain/repositories";
import type { ImageResult } from "../domain/types";

interface UseImageGeneratorReturn {
  headline: string;
  setHeadline: (value: string) => void;
  result: ImageResult | null;
  loading: boolean;
  error: string | null;
  generate: () => Promise<void>;
  reset: () => void;
}

export function useImageGenerator(
  repo: IImageRepository
): UseImageGeneratorReturn {
  const [headline, setHeadline] = useState("");
  const [result, setResult] = useState<ImageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!headline.trim() || headline.trim().length < 2) {
      setError("請輸入至少2個字的新聞標題");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await repo.generateImage(headline);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "圖片生成失敗，請稍後重試");
    } finally {
      setLoading(false);
    }
  }, [headline, repo]);

  const reset = useCallback(() => {
    setHeadline("");
    setResult(null);
    setError(null);
  }, []);

  return { headline, setHeadline, result, loading, error, generate, reset };
}
