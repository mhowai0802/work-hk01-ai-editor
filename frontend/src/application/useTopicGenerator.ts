import { useCallback, useState } from "react";
import type { ITopicRepository } from "../domain/repositories";
import type { TopicResult } from "../domain/types";

interface UseTopicGeneratorReturn {
  passage: string;
  setPassage: (value: string) => void;
  result: TopicResult | null;
  loading: boolean;
  error: string | null;
  generate: () => Promise<void>;
  reset: () => void;
}

export function useTopicGenerator(
  repo: ITopicRepository
): UseTopicGeneratorReturn {
  const [passage, setPassage] = useState("");
  const [result, setResult] = useState<TopicResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!passage.trim() || passage.trim().length < 10) {
      setError("請輸入至少10個字的文章段落");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await repo.generateTopics(passage);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "主題生成失敗，請稍後重試");
    } finally {
      setLoading(false);
    }
  }, [passage, repo]);

  const reset = useCallback(() => {
    setPassage("");
    setResult(null);
    setError(null);
  }, []);

  return { passage, setPassage, result, loading, error, generate, reset };
}
