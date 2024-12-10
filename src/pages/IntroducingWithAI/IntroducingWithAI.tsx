import { useEffect, useRef, useCallback, useState, useContext } from "react";

import { RealtimeClient } from "@openai/realtime-api-beta";
// @ts-ignore
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
// @ts-ignore
import { WavRecorder, WavStreamPlayer } from "../../lib/wavtools/index.js";
// @ts-ignore
import { createSummaryOfStudent, feedbackAndGeneralInformationInstruction, introductionWithAIInstruction } from "../../utils/conversation_config.ts";


import { Link, useNavigate } from "react-router-dom";


import CrossIconWhite from "../../assets/icons/cross-icon-white.svg";
import LeftArrowIcon from "../../assets/icons/left-arrow.svg";
import { SpeakingDots } from '../../components/SpeakingDots/index';

import { useTranslation } from "react-i18next";
import toast from 'react-hot-toast';
import { Button, Loader } from '../../components/index.ts';
import { openai } from '../../vars/open-ai.ts';
import { parseFeedbackString } from '../../utils/informationParser.ts';
import SchoolNamesContext from '../../context/SchoolNamesContext.tsx';

interface RealtimeEvent {
  time: string;
  source: "client" | "server";
  count?: number;
  event: { [key: string]: any };
}

const apiKey = import.meta.env.VITE_OPEN_AI_API_KEY;

export const IntroducingWithAI = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000, bufferLength: 4096 })
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000, bufferLength: 4096 })
  );
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient({
      apiKey: apiKey,
      dangerouslyAllowAPIKeyInBrowser: true,
    })
  );

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [natureLanguage, setNatureLanguage] = useState("");
  const [foreingLanguage, setForeingLanguage] = useState("");
  const [role, setRole] = useState("");
  const [summary, setSummary] = useState("");

  const eventsScrollHeightRef = useRef(0);
  const eventsScrollRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<ItemType[]>([]);

  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const [connectionLoading, setConnectionLoading] = useState(false);

  const getFeedBackAndGeneralInformation = async (): Promise<any> => {

    const conversation = items.map(item => item.formatted.transcript).join(" ");

    const credentialsOfUser = conversation.split("===")[0];

    try {
      setLoading(true);
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that asks for personal information to create a profile for the user. Please ask for the user's first name, last name, native language, foreign language, and role.",
          },
          {
            role: "user",
            content: `${feedbackAndGeneralInformationInstruction(credentialsOfUser)}`,
          },
        ],
        max_tokens: 150,
      });

      if (response.choices[0].message.content) {

        const parsedData = parseFeedbackString(response.choices[0].message.content);

        setFirstName(parsedData.firstName);
        setLastName(parsedData.lastName);
        setNatureLanguage(parsedData.nativeLanguage);
        setForeingLanguage(parsedData.foreignLanguage);
        setRole(parsedData.role);
        setSummary(parsedData.summary);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching topics from OpenAI:", error);
      return null;
    }
  };

  const connectConversation = useCallback(async () => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;
    client.updateSession({ turn_detection: { type: "server_vad" }, voice: "echo" });

    setConnectionLoading(true);

    // Set state variables
    setIsConnected(true);
    setRealtimeEvents([]);
    setItems(client.conversation.getItems());

    try {
      await Promise.all([
        client.connect(),
        wavRecorder.begin(),
        wavStreamPlayer.connect()
      ]);

      client.sendUserMessageContent([
        {
          type: "input_text",
          text: "say something first",
        },
      ]);

      if (client.getTurnDetectionType() === "server_vad") {
        await wavRecorder.record((data: any) => client.appendInputAudio(data.mono));

        setConnectionLoading(false);
      } else {
        toast.error("Something went wrong, please try again");
      }
    } catch (error: any) {
      toast.error("Something went wrong, please try again");
    } finally {
      setConnectionLoading(false);
    }
  }, []);

  const disconnectConversation = useCallback(async () => {
    setIsConnected(false);
    setRealtimeEvents([]);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;

    await wavStreamPlayer.interrupt();
    await getFeedBackAndGeneralInformation();
  }, [items, getFeedBackAndGeneralInformation]);


  useEffect(() => {
    if (eventsScrollRef.current) {
      const eventsEl = eventsScrollRef.current;
      const scrollHeight = eventsEl.scrollHeight;

      if (scrollHeight !== eventsScrollHeightRef.current) {
        eventsEl.scrollTop = scrollHeight;
        eventsScrollHeightRef.current = scrollHeight;
      }
    }
  }, [realtimeEvents]);

  useEffect(() => {
    const conversationEls = [].slice.call(
      document.body.querySelectorAll("[data-conversation-content]")
    );

    for (const el of conversationEls) {
      const conversationEl = el as HTMLDivElement;

      conversationEl.scrollTop = conversationEl.scrollHeight;
    }
  }, [items]);

  useEffect(() => {
    // Get refs
    console.time("clientRef.current START");
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = clientRef.current;

    // Set instructions
    client.updateSession({ instructions: introductionWithAIInstruction() });
    // Set transcription, otherwise we don't get user transcriptions back
    client.updateSession({ input_audio_transcription: { model: "whisper-1" } });

    // handle realtime events from client + server for event logging
    client.on("realtime.event", (realtimeEvent: RealtimeEvent) => {
      setRealtimeEvents((realtimeEvents) => {
        const lastEvent = realtimeEvents[realtimeEvents.length - 1];

        if (lastEvent?.event.type === realtimeEvent.event.type) {
          // if we receive multiple events in a row, aggregate them for display purposes
          lastEvent.count = (lastEvent.count || 0) + 1;
          return realtimeEvents.slice(0, -1).concat(lastEvent);
        } else {
          return realtimeEvents.concat(realtimeEvent);
        }
      });
    });
    console.timeEnd("clientRef.current END");

    client.on("error", (event: any) => {
      console.error(event);
    });

    client.on("conversation.interrupted", async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();

      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;

        await client.cancelResponse(trackId, offset);
      }
    });

    client.on("conversation.updated", async ({ item, delta }: any) => {
      const items = client.conversation.getItems();

      async function conversationCheck (item: ItemType) {
        if (item.formatted.transcript) {
          const transcriptionText = item.formatted.transcript.toLowerCase();

          console.log("Transcription:", transcriptionText);


          const endKeywords = ["goodbye", "exit", "end", "stop", "thank you"];

          if (endKeywords.some((keyword) => transcriptionText.includes(keyword))) {

            disconnectConversation();
            return;
          }
        }
      };

      await conversationCheck(item);

      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }

      if (item.status === "completed" && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }

      setItems(items);
    });
    const items = client.conversation.getItems();
    setItems(items);


    return () => {
      client.reset();
    };
  }, []);

  const handleNavigateToCreateProfile = () => {
    navigate(`/${currentSchoolName}/join-your-school`, { state: { firstName, lastName, natureLanguage, foreingLanguage, role, summary } });
  };

  return (
    <div
      data-component="ConsolePage"
      className="flex flex-col justify-between h-[100vh] w-full m-auto"
    >
      {loading && <Loader />}
      <div className="pt-[100px] h-[calc(100dvh-142px)]">
        <div className="p-[20px] border-b-[1px] fixed z-[1] top-0 w-full bg-white">
          <div className="absolute top-[20px] left-[20px]">
            <Link to={'/'}>
              <img src={`${LeftArrowIcon}`} />
            </Link>
          </div>
          <div className="flex flex-col gap-[6px]">
            <h2 className="text-center text-[20px]">{t("conversationPage.headerTitle")}</h2>
          </div>
        </div>

        {!isConnected ? (
          <div className="px-[20px] pb-[200px] h-[calc(100dvh-170px)] w-full m-auto md:w-[700px]">
            {items.length === 0 ? (
              <div className="h-full justify-center flex items-center text-center">
                <div>It's your first interaction with Teacher AI, introduce yourself</div>
              </div>
            ) : (
              <div className="h-full flex justify-center items-center">
                <Button
                  className="text-main border-main px-[22px] hover:bg-main-red hover:text-white"
                  onClick={() => handleNavigateToCreateProfile()}
                >
                  {t("authPages.introducingAIPage.createProfileButton")}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[100dvh] mt-[-120px] flex items-center justify-center">
            {connectionLoading ? <p className="text-center">{t("conversationPage.connectingText")}</p> : <SpeakingDots isConnected={isConnected} />}
          </div>
        )}
      </div>

      <div
        className={`
          ${!isConnected ? "justify-end" : "justify-start"}
          flex items-end min-h-[90px] pt-[30px]
          pb-[20px] fixed bottom-0 z-0 px-[20px]
          w-full bg-white
        `}
      >
        {isConnected && (
          <button
            className="relative z-[2] bg-main p-[12px] rounded-[50%]"
            onClick={disconnectConversation}
          >
            <img src={`${CrossIconWhite}`} alt="close" />
          </button>
        )}

        <div className="absolute top-[0] left-[10px] w-[calc(100%-20px)] z-[1] flex justify-center">
          <button
            className={`
                ${!isConnected && "border-[1px]"} 
                rounded-[50%] bg-white p-[10px] w-[77.6px] h-[77.6px]
              `}
            style={{
              boxShadow: isConnected
                ? "5px 4px 20px 0px rgba(0, 0, 0, 0.13)"
                : "",
              backgroundImage: isConnected
                ? `url(/pause-icon.svg)`
                : `url(/microphone-light.svg)`,
              backgroundPositionX: "center",
              backgroundPositionY: "center",
              backgroundRepeat: "no-repeat",
            }}
            onClick={!isConnected ? connectConversation : disconnectConversation}
          />
        </div>
      </div>
    </div>
  );
};