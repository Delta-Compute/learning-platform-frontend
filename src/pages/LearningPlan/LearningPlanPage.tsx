import { Link, useParams } from "react-router-dom";

import MicrophoneIcon from "../../assets/icons/microphone-light.svg";
import { useClassById } from '../../hooks/api/classes';
import { useContext, useEffect, useState } from 'react';
import { openai } from '../../vars/open-ai';
import { Loader } from '../../components';
import { Class } from '../../types/class';
import { teacherInstuctionsWithLearningPlan } from '../../utils';
import UserContext from '../../context/UserContext';
import { AssignmentModal } from '../Conversation/AssignmentModal';

interface Topic {
  title: string;
  topic: string;
  description: string;
  time: string;
}

export const LearningPlanPage = () => {
  const [classRoomItem, setClassRoomItem] = useState<Class | null>(null);
  const [generatedAssignments, setGeneratedAssignments] = useState<Topic[] | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [chosenTopic, setChosenTopic] = useState<Topic>({ title: "", topic: "", description: "", time: "" });
  const { user } = useContext(UserContext);
  const [loader, setLoader] = useState(false);

  console.log(generatedAssignments, 'generatedAssignments');
  

  const { classRoomId } = useParams();
  const { data, isPending, refetch } = useClassById(classRoomId as string);

  useEffect(() => {
    refetch();
  }, [classRoomId, refetch]);

  useEffect(() => {
    if (data) {
      setClassRoomItem(data);
    }
  }, [data, classRoomId]);

  useEffect(() => {
    const fetchTopics = async () => {
      if (classRoomItem && classRoomItem.learningPlan) {
        setLoader(true);
        const topics: Topic[] = await getThreeTopics(classRoomItem.learningPlan) as Topic[];

        if(topics) {
          setGeneratedAssignments(topics);
        }
        setLoader(false);
      }
    }
    fetchTopics();
  }, [classRoomItem]);


  const getThreeTopics = async (learningPlan: string) => {
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

      let topics = '';
      
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

        const title = lines.find(line => line.startsWith("**Title**"))?.replace("**Title**: ", "").trim();
        const topicL = lines.find(line => line.startsWith("**Topic**"))?.replace("**Topic**: ", "").trim();
        const description = lines.find(line => line.startsWith("**Description**"))?.replace("**Description**: ", "").trim();
        const time = parseInt(lines.find(line => line.startsWith("**Time**"))?.replace("**Time**: ", "").trim()  || "15");
        

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
  }


  return (
    <div>
      {isPending || loader && <Loader />}
      <div className="fixed top-0 w-full py-[20px] border-b-[1px]">
        <h2 className="text-center text-[20px]">Teacher tasks</h2>
      </div>

      <div className="pt-[100px] ">
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

          <ul className="py-[20px] flex flex-col items-center gap-[8px] px-[20px]">
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

        </div>
        <div
          className="
            flex justify-center items-center flex-col fixed bottom-0
            w-full pb-[12px] bg-white
          "
        >
          <div className="flex flex-col justify-center items-center gap-[5px]">
            <svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.49809 15H9.49809M5.49809 10H13.4981M5.00009 2.5C3.44409 2.547 2.51709 2.72 1.87509 3.362C0.996094 4.242 0.996094 5.657 0.996094 8.488V14.994C0.996094 17.826 0.996094 19.241 1.87509 20.121C2.75309 21 4.16809 21 6.99609 21H11.9961C14.8251 21 16.2391 21 17.1171 20.12C17.9971 19.241 17.9971 17.826 17.9971 14.994V8.488C17.9971 5.658 17.9971 4.242 17.1171 3.362C16.4761 2.72 15.5481 2.547 13.9921 2.5" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.99609 2.75C4.99609 1.784 5.78009 1 6.74609 1H12.2461C12.7102 1 13.1553 1.18437 13.4835 1.51256C13.8117 1.84075 13.9961 2.28587 13.9961 2.75C13.9961 3.21413 13.8117 3.65925 13.4835 3.98744C13.1553 4.31563 12.7102 4.5 12.2461 4.5H6.74609C6.28197 4.5 5.83685 4.31563 5.50866 3.98744C5.18047 3.65925 4.99609 3.21413 4.99609 2.75Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            <p className="text-[15px] font-semibold">Let's create a new task</p>
          </div>
          <Link
            to={`/teacher-tasks/${classRoomId}`}
            className="border-[1px] p-[10px] rounded-[50%] mt-[20px]"
          >
            <img src={`${MicrophoneIcon}`} alt="microphone" />
          </Link>
        </div>
      </div>
      
      {user?.role !== "student" && chosenTopic && <AssignmentModal
        assignmentTopic={chosenTopic.topic}
        assignmentTitle={chosenTopic.title}
        assignmentTime={+chosenTopic.time * 60}
        assignmentDescription={chosenTopic.description}
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
      />}
    </div>
  );
};
