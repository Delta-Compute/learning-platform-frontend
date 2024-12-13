import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";

import { usePlaygroundState } from "./usePlaygroundState";
import { VoiceId, PlaygroundState } from "../data";

import { apiClient } from "../../../vars";

export type ConnectFn = () => Promise<void>;

type TokenGeneratorData = {
  shouldConnect: boolean;
  wsUrl: string;
  token: string;
  pgState: PlaygroundState;
  voice: VoiceId;
  disconnect: () => Promise<void>;
  connect: ConnectFn;
};

const ConnectionContext = createContext<TokenGeneratorData | undefined>(
  undefined,
);

const serverUrl =  import.meta.env.VITE_LIVEKIT_SERVER_URL;

export const ConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connectionDetails, setConnectionDetails] = useState<{
    wsUrl: string;
    token: string;
    shouldConnect: boolean;
    voice: VoiceId;
  }>({ wsUrl: "", token: "", shouldConnect: false, voice: VoiceId.alloy });

  const { pgState} = usePlaygroundState();

  const connect = async () => {
    if (!pgState.openaiAPIKey) {
      throw new Error("OpenAI API key is required to connect");
    }

    try {
      const response = await apiClient.post("/livekit/generate-token", {
        ...pgState,
      });

      setConnectionDetails({
        wsUrl: serverUrl,
        token: response.data.accessToken,
        shouldConnect: true,
        voice: pgState.sessionConfig.voice,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const disconnect = useCallback(async () => {
    setConnectionDetails((prev) => ({ ...prev, shouldConnect: false }));
  }, []);

  // Effect to handle API key changes
  useEffect(() => {
    if (pgState.openaiAPIKey === null && connectionDetails.shouldConnect) {
      disconnect();
    }
  }, [pgState.openaiAPIKey, connectionDetails.shouldConnect, disconnect]);

  return (
    <ConnectionContext.Provider
      value={{
        wsUrl: connectionDetails.wsUrl,
        token: connectionDetails.token,
        shouldConnect: connectionDetails.shouldConnect,
        voice: connectionDetails.voice,
        pgState,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);

  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }

  return context;
};