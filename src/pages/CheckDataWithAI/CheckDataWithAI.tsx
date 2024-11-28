import { useEffect, useRef, useCallback, useState, useContext, ChangeEvent } from "react";

import { RealtimeClient } from "@openai/realtime-api-beta";
// @ts-ignore
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
// @ts-ignore
import { WavRecorder, WavStreamPlayer } from "../../lib/wavtools/index.js";
// @ts-ignore
import { getFavoiriteColorAndNumberInstructions, parseSecretWordsInstructions } from "../../utils/conversation_config.ts";


import { Link, useLocation } from "react-router-dom";


import CrossIconWhite from "../../assets/icons/cross-icon-white.svg";
import LeftArrowIcon from "../../assets/icons/left-arrow.svg";
import { SpeakingDots } from '../../components/SpeakingDots/index';

import { useTranslation } from "react-i18next";
import toast from 'react-hot-toast';
import { Button, Loader, Modal } from '../../components/index.ts';
import { openai } from '../../vars/open-ai.ts';
import SchoolNamesContext from '../../context/SchoolNamesContext.tsx';
import { parseSecrets } from '../../utils/parseSecrets.ts';
import { Input } from '@headlessui/react';
import { cn } from '../../utils/tailwind-cn.ts';
import { useLogin } from '../../hooks/index.ts';
import { UserAuthType } from '../../types/user.ts';

interface RealtimeEvent {
  time: string;
  source: "client" | "server";
  count?: number;
  event: { [key: string]: any };
}

const apiKey = import.meta.env.VITE_OPEN_AI_API_KEY;

export const CheckDataAI = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const state = location.state as { email: string };

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

  const [infoForLogin, setInfoForLogin] = useState({
    email: state.email,
    secretWords:
    {
      color: "",
      number: ""
    }
  });

  const eventsScrollHeightRef = useRef(0);
  const eventsScrollRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<string>(new Date().toISOString());

  const [items, setItems] = useState<ItemType[]>([]);
  const [isOpened, setIsOpened] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const [connectionLoading, setConnectionLoading] = useState(false);

  const { isPending, mutate } = useLogin();

  const getFeedBackAndGeneralInformation = async (): Promise<any> => {

    const conversation = items.map(item => item.formatted.transcript).join(" ");

    try {
      setLoading(true);
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that asks for favorite color and number",
          },
          {
            role: "user",
            content: `${getFavoiriteColorAndNumberInstructions(conversation)}`,
          },
        ],
        max_tokens: 150,
      });

      if (response.choices[0].message.content) {
        const parsedData = parseSecrets(response.choices[0].message.content);

        setInfoForLogin({
          ...infoForLogin,
          secretWords: {
            color: parsedData.color,
            number: parsedData.number
          }
        });
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
    startTimeRef.current = new Date().toISOString();
    setIsConnected(true);
    setRealtimeEvents([]);
    setItems(client.conversation.getItems());

    try {
      await Promise.all([
        client.connect(),
        wavRecorder.begin(),
        wavStreamPlayer.connect()
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
    getFeedBackAndGeneralInformation();
    setIsConnected(false);
    setRealtimeEvents([]);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;

    await wavStreamPlayer.interrupt();
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
    client.updateSession({ instructions: parseSecretWordsInstructions() });
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setInfoForLogin({ ...infoForLogin, email });

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleAuthWithAI = async () => {
    if (emailError || !infoForLogin.secretWords.color || !infoForLogin.secretWords.number) {
      return;
    }

    await mutate({
      email: infoForLogin.email,
      password: "",
      school: currentSchoolName,
      auth: UserAuthType.AI,
      secretWords: {
        color: infoForLogin.secretWords.color,
        number: infoForLogin.secretWords.number
      }
    }, {
      onError: () => {
        toast.error("Error authenticating with AI");
      }
    });
  }

  return (
    <div
      data-component="ConsolePage"
      className="flex flex-col justify-between h-[100vh] w-full m-auto"
    >
      {(loading || isPending) && <Loader />}
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
                <div>{t("conversationPage.secondTitleSecret")}</div>
              </div>
            ) : (
              <div className="h-full flex justify-center items-center">
                <Button
                  className="text-main border-main px-[22px] hover:bg-main-red hover:text-white"
                  onClick={() => setIsOpened(true)}
                >
                  {t("authPages.signIn.checkDataButton")}
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
      <Modal isOpen={isOpened} onClose={() => setIsOpened(false)}>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-[24px] font-semibold text-center mb-4 text-[#001434]">
            {t("authPages.signIn.aiAuthModalTitle")}
          </h2>
          <Input
            type='email'
            value={infoForLogin.email}
            onChange={(e) => handleChange(e)}
            placeholder={t("authPages.signIn.aiAuthEmailPlaceholder")}
            className={cn('w-full mt-4', emailError && 'border-red-500')}
            required
          />
          {emailError && <p className="text-red-500 mt-2">{emailError}</p>}

          <Input
            type='text'
            value={infoForLogin.secretWords.color}
            onChange={(e) => setInfoForLogin({ ...infoForLogin, secretWords: { ...infoForLogin.secretWords, color: e.target.value } })}
            placeholder={t("authPages.signIn.aiAuthColorPlaceholder")}
            className={cn('w-full mt-4', emailError && 'border-red-500')}
            required
          />

          <Input
            type='number'
            value={infoForLogin.secretWords.number}
            onChange={(e) => setInfoForLogin({ ...infoForLogin, secretWords: { ...infoForLogin.secretWords, number: e.target.value } })}
            placeholder={t("authPages.signIn.aiAuthNumberPlaceholder")}
            className={cn('w-full mt-4', emailError && 'border-red-500')}
            required
          />

          <Button
            className="mt-4 bg-main text-white w-full"
            onClick={() => handleAuthWithAI()}
          >
            {t("authPages.signIn.aiAuthModalButton")}
          </Button>
        </div>
      </Modal>
    </div>
  );
};