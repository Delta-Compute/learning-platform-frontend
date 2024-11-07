import { instructionsForSummary } from "../../utils";

import { AssignmentApiService } from "../../services";
import { useMutation } from "@tanstack/react-query";

import { openai } from "../../vars/open-ai.ts";

export const useGenerateAssignmentSummary = () => {
  const { mutate: updateAssignmentMutation } = useMutation({
    mutationFn: (data: { assignmentId: string, summary: string }) => AssignmentApiService.updateAssignment(data.assignmentId, { summary: data.summary }),
  });

  const generateAssignmentSummary = async (assignmentId: string, summary: string) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that selects key topics for students.",
          },
          {
            role: "user",
            content: `${instructionsForSummary(summary || "")}`,
          },
        ],
        max_tokens: 150,
      });

      updateAssignmentMutation({
        assignmentId: assignmentId as string,
        summary: response.choices[0].message.content as string,
      });
    }

    catch (error) {
      console.log(error);
    }
  };

  return {
    generateAssignmentSummary,
  };
};