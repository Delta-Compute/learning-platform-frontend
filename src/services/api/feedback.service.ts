import { useMutation } from "@tanstack/react-query";
import { createFeedback, CreateFeedbackDto } from '../../hooks/api/feedback';

export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: (feedback: CreateFeedbackDto) => createFeedback(feedback),
    onSuccess: (data) => {
      console.log("Feedback created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating feedback:", error);
    },
  });
};