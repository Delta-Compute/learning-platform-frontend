import React, { useState, useEffect, SetStateAction, Dispatch } from "react";


import { useTranslation } from "react-i18next";

import { Loader } from "../../components";

import { openai } from "../../vars/open-ai";
import { teacherInstuctionsWithLearningPlan } from "../../utils";
import { Topic } from '../../types/topic';

interface AssignmentsBasedOnLearningPlanProps {
  feedback: string;
  connectConversation: () => void;
  setTask: Dispatch<SetStateAction<Topic | null>>;
}

export const TasksForImproving: React.FC<AssignmentsBasedOnLearningPlanProps> = ({ feedback, connectConversation, setTask }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [generatedAssignments, setGeneratedAssignments] = useState<Topic[] | null>(null);


  useEffect(() => {
    const fetchTopics = async () => {
      if (generatedAssignments?.length) {
        return;
      }
      if (feedback && !generatedAssignments?.length) {
        setLoading(true);
        const topics = await getThreeTopics();
        if (topics?.length) {
          setGeneratedAssignments(topics);
        }
        setLoading(false);
      }
    };
    fetchTopics();
  }, [feedback, generatedAssignments]);


  const getThreeTopics = async (): Promise<any> => {
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
            content: `${teacherInstuctionsWithLearningPlan(feedback)}`,
          },
        ],
        max_tokens: 250,
      });

      let topics = "";

      if (response.choices[0].message.content) {
        topics = response.choices[0].message.content.trim();
      }

      const topicArray = topics.trim().split("===");

      const topicsArrayChecked = [] as string[];

      topicArray.forEach((topic) => {
        if (topic.includes("**Title**") && topic.includes("**Topic**") && topic.includes("**Description**")) {
          topicsArrayChecked.push(topic);
        }
      });
      return topicsArrayChecked
        .map((topic: string) => {
          const lines = topic.trim().split("\n");

          const title = lines.find(line =>
            line.startsWith("**Title**") || line.startsWith("**Title:**")
          )?.replace(/^\*\*Title\**:?\s*/, "").trim();

          const topicL = lines.find(line =>
            line.startsWith("**Topic**") || line.startsWith("**Topic:**")
          )?.replace(/^\*\*Topic\**:?\s*/, "").trim();

          const description = lines.find(line =>
            line.startsWith("**Description**") || line.startsWith("**Description:**")
          )?.replace(/^\*\*Description\**:?\s*/, "").trim();

          if (title && topicL && description) {
            return { title, topic: topicL, description } as Topic;
          }

          return null;
        })
        .filter(Boolean);

    } catch (error) {
      console.error("Error fetching topics from OpenAI:", error);
      return null;
    }
  };

  const handleSetChosenTopic = async (topic: Topic) => {
    setTask(topic);

    setTimeout(() => {
      connectConversation();
    }, 100);
  };

  return (
    <div>
      {loading && <Loader />}
      <div>
        <div className="flex flex-col gap-[5px]">

          <p className="font-semibold text-center">
            {t("conversationPage.assignmentsBasedOnSummury")}
          </p>
        </div>

        <ul className="py-[20px] flex flex-col items-center gap-[8px]">
          {generatedAssignments && generatedAssignments.map((task) => (
            <li
              key={task.title}
              className="w-full py-[10px] px-[14px] rounded-[20px] text-center bg-gray-200"
              onClick={() => handleSetChosenTopic(task)}
            >
              {task.title || ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};