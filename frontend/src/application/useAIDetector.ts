import { useCallback, useState } from "react";
import type { IDetectRepository } from "../domain/repositories";
import type { AIDetectionResult } from "../domain/types";

interface UseAIDetectorReturn {
  passage: string;
  setPassage: (value: string) => void;
  result: AIDetectionResult | null;
  loading: boolean;
  error: string | null;
  detect: () => Promise<void>;
  reset: () => void;
}

export function useAIDetector(repo: IDetectRepository): UseAIDetectorReturn {
  const [passage, setPassage] = useState("");
  const [result, setResult] = useState<AIDetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(async () => {
    if (!passage.trim() || passage.trim().length < 10) {
      setError("請輸入至少10個字的文章段落");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await repo.detectAI(passage);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI 檢測失敗，請稍後重試");
    } finally {
      setLoading(false);
    }
  }, [passage, repo]);

  const reset = useCallback(() => {
    setPassage("");
    setResult(null);
    setError(null);
  }, []);

  return { passage, setPassage, result, loading, error, detect, reset };
}
