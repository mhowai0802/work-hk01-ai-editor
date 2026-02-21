export interface TopicResult {
  topics: string[];
  passageSummary: string;
}

export interface ImageResult {
  imageUrl: string;
  promptUsed: string;
}

export interface AIDetectionResult {
  isAiGenerated: boolean;
  aiProbability: number;
  confidence: string;
  reasons: string[];
  suggestion: string;
}
