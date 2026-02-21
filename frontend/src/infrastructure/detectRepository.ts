import type { IDetectRepository } from "../domain/repositories";
import type { AIDetectionResult } from "../domain/types";
import apiClient from "./apiClient";

interface DetectApiResponse {
  is_ai_generated: boolean;
  ai_probability: number;
  confidence: string;
  reasons: string[];
  suggestion: string;
}

export class DetectRepository implements IDetectRepository {
  async detectAI(passage: string): Promise<AIDetectionResult> {
    const { data } = await apiClient.post<DetectApiResponse>(
      "/api/detect/ai",
      { passage }
    );
    return {
      isAiGenerated: data.is_ai_generated,
      aiProbability: data.ai_probability,
      confidence: data.confidence,
      reasons: data.reasons,
      suggestion: data.suggestion,
    };
  }
}
