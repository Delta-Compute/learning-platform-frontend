import { apiClient } from '../../vars';

export interface CreateFeedbackDto {
  userId: string;
  satisfaction: string;
  likedFeatures: string;
  improvements: string;
  missingFeatures: string;
  recommendation: string;
}

export const createFeedback = async (
  feedback: CreateFeedbackDto
): Promise<CreateFeedbackDto | null> => {
  try {
    const response = await apiClient.post<CreateFeedbackDto>(
      "/app-feedback/",
      feedback
    );
    return response.data;
  } catch (error) {
    console.error("Error creating feedback:", error);
    return null;
  }
};