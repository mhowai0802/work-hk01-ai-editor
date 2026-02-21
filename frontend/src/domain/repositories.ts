import type { AIDetectionResult, ImageResult, TopicResult } from "./types";

export interface ITopicRepository {
  generateTopics(passage: string): Promise<TopicResult>;
}

export interface IImageRepository {
  generateImage(headline: string): Promise<ImageResult>;
}

export interface IDetectRepository {
  detectAI(passage: string): Promise<AIDetectionResult>;
}
