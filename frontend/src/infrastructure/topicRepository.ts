import type { ITopicRepository } from "../domain/repositories";
import type { TopicResult } from "../domain/types";
import apiClient from "./apiClient";

interface TopicApiResponse {
  topics: string[];
  passage_summary: string;
}

export class TopicRepository implements ITopicRepository {
  async generateTopics(passage: string): Promise<TopicResult> {
    const { data } = await apiClient.post<TopicApiResponse>(
      "/api/topic/generate",
      { passage }
    );
    return {
      topics: data.topics,
      passageSummary: data.passage_summary,
    };
  }
}
