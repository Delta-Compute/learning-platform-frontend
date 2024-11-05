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
}

export const LearningPlanPage = () => {
  const [classRoomItem, setClassRoomItem] = useState<Class | null>(null);
  const [generatedAssignments, setGeneratedAssignments] = useState<Topic[] | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [chosenTopic, setChosenTopic] = useState<Topic>({ title: "", topic: "", description: "" });
  const { user } = useContext(UserContext);
  const [loader, setLoader] = useState(false);

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

        return { title, topic: topicL, description };
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
          <p className="font-semibold text-center">
            Task based on learning plan
          </p>


          <ul className="py-[20px] flex flex-col items-center gap-[8px]">
            {generatedAssignments && generatedAssignments.map((task) => (
              <li
                key={task.title}
                className="w-[400px] py-[8px] rounded-[20px] text-center bg-gray-200"
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
          <p className="text-[15px] font-semibold">Let's create a new task</p>
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
        assignmentDescription={chosenTopic.description}
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
      />}
    </div>
  );
};
