export interface TopicResult {
  topic: string;
  tags: string[];
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
