import { useState, useEffect, useContext } from "react";

import { useParams } from "react-router-dom";

import UserContext from "../../context/UserContext";

import { useClassById } from "../../hooks/api/classes";

import { AssignmentModal } from "./AssignmentModal";
import { Loader } from "../../components";

import { openai } from "../../vars/open-ai";
import { teacherInstuctionsWithLearningPlan } from "../../utils";

interface Topic {
  title: string;
  topic: string;
  description: string;
  time: string;
};

export const AssignmentsBasedOnLearningPlan = () => {
  const { user } = useContext(UserContext);
  const { classRoomId } = useParams();
  const { data: classRoom } = useClassById(classRoomId as string);

  const [loading, setLoading] = useState(false);
  const [generatedAssignments, setGeneratedAssignments] = useState<Topic[] | null>(null);
  const [chosenTopic, setChosenTopic] = useState<Topic>({ title: "", topic: "", description: "", time: "" });
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      if (classRoom && classRoom.learningPlan) {
        console.log(classRoom)
        setLoading(true);

        const topics: Topic[] = (await getThreeTopics(classRoom.learningPlan) ) || [];

        if (topics) {
          setGeneratedAssignments(topics);
        }

        setLoading(false);
      }
    }
    
    fetchTopics();
  }, [classRoom]);


  const getThreeTopics = async (learningPlan: string): Promise<any> => {
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
            content: `${teacherInstuctionsWithLearningPlan(learningPlan)}`,
          },
        ],
        max_tokens: 150,
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
      return topicsArrayChecked.map((topic: string) => {
        const lines = topic.trim().split("\n");

        const title = lines.find(line => 
          line.startsWith("**Title**") || line.startsWith("**Title:**")
        )?.replace(/^\*\*Title\**:\s*/, "").trim();
        const topicL = lines.find(line => 
          line.startsWith("**Topic**") || line.startsWith("**Topic:**")
        )?.replace(/^\*\*Title\**:\s*/, "").trim();
        const description = lines.find(line => 
          line.startsWith("**Description**") || line.startsWith("**Description:**")
        )?.replace(/^\*\*Title\**:\s*/, "").trim();
        const time = parseInt(
          lines.find(line => 
            line.startsWith("**Time**") || line.startsWith("**Time:**")
          )?.replace("**Time**: ", "").replace("**Time**", "") || "0"
        );
        

        return { title, topic: topicL, description, time };
      });

    } catch (error) {
      console.error("Error fetching topics from OpenAI:", error);
      return null;
    }
  };

  const handleSetChosenTopic = (topic: Topic) => {
    setChosenTopic(topic);
    setIsAssignmentModalOpen(true);
  };

  return (
    <div>
      {loading && <Loader />}
      <div>
          <div className="flex flex-col justify-center items-center gap-[5px]">
            <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M2.555 15.12C2.275 15.12 2.06 15.04 1.91 14.88C1.76 14.72 1.685 14.5 1.685 14.22V5.205C1.685 4.915 1.765 4.695 1.925 4.545C2.085 4.385 2.305 4.305 2.585 4.305C2.835 4.305 3.03 4.355 3.17 4.455C3.32 4.545 3.455 4.705 3.575 4.935L7.28 11.79H6.8L10.505 4.935C10.625 4.705 10.755 4.545 10.895 4.455C11.035 4.355 11.23 4.305 11.48 4.305C11.76 4.305 11.975 4.385 12.125 4.545C12.275 4.695 12.35 4.915 12.35 5.205V14.22C12.35 14.5 12.275 14.72 12.125 14.88C11.985 15.04 11.77 15.12 11.48 15.12C11.2 15.12 10.985 15.04 10.835 14.88C10.685 14.72 10.61 14.5 10.61 14.22V7.275H10.94L7.79 13.02C7.69 13.19 7.585 13.315 7.475 13.395C7.365 13.475 7.215 13.515 7.025 13.515C6.835 13.515 6.68 13.475 6.56 13.395C6.44 13.305 6.335 13.18 6.245 13.02L3.065 7.26H3.425V14.22C3.425 14.5 3.35 14.72 3.2 14.88C3.06 15.04 2.845 15.12 2.555 15.12Z" 
                fill="#292D32"
              />
              <path d="M16.5 8.5H25.5" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 13.5H25.5" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 18.5H25.5" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 23.5H25.5" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            <p className="font-semibold text-center">
              Assignments based on learning plan
            </p>
          </div>

          <ul className="py-[20px] flex flex-col items-center gap-[8px]">
            {generatedAssignments && generatedAssignments.map((task) => (
              <li
                key={task.title}
                className="w-full py-[10px] px-[14px] rounded-[20px] text-center bg-gray-200"
                onClick={() => handleSetChosenTopic(task)}
              >
                {task.title}
              </li>
            ))}
          </ul>

          {user?.role !== "student" && chosenTopic && <AssignmentModal
            assignmentTopic={chosenTopic.topic}
            assignmentTitle={chosenTopic.title}
            assignmentTime={+chosenTopic.time * 60}
            assignmentDescription={chosenTopic.description}
            isOpen={isAssignmentModalOpen}
            onClose={() => setIsAssignmentModalOpen(false)}
          />}
        </div>
    </div>
  );
};