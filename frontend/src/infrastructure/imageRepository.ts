import type { IImageRepository } from "../domain/repositories";
import type { ImageResult } from "../domain/types";
import apiClient from "./apiClient";

interface ImageApiResponse {
  image_url: string;
  prompt_used: string;
}

export class ImageRepository implements IImageRepository {
  async generateImage(headline: string): Promise<ImageResult> {
    const { data } = await apiClient.post<ImageApiResponse>(
      "/api/image/generate",
      { headline }
    );
    return {
      imageUrl: data.image_url,
      promptUsed: data.prompt_used,
    };
  }
}
