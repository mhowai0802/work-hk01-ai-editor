import type { ITopicRepository } from "../domain/repositories";
import type { TopicResult } from "../domain/types";
import apiClient from "./apiClient";

interface TopicApiResponse {
  topic: string;
  tags: string[];
}

export class TopicRepository implements ITopicRepository {
  async generateTopics(passage: string): Promise<TopicResult> {
    const { data } = await apiClient.post<TopicApiResponse>(
      "/api/topic/generate",
      { passage }
    );
    return {
      topic: data.topic,
      tags: data.tags,
    };
  }
}
