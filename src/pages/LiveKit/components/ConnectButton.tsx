import { useState, useEffect, useCallback } from "react";

import { useConnection, usePlaygroundState } from "../hooks";

import { Loader2 } from "lucide-react";

import MicrophoneIcon from "../../../assets/icons/microphone-light.svg";

export const ConnectButton = () => {
  const { connect, disconnect, shouldConnect } = useConnection();
  const [connecting, setConnecting] = useState(false);
  const [initiateConnectionFlag, setInitiateConnectionFlag] = useState(false);
  const { pgState } = usePlaygroundState();

  const handleConnectionToggle = async () => {
    if (shouldConnect) {
      await disconnect();
    } else {
      await initiateConnection();
    }
  };

  const initiateConnection = useCallback(async () => {
    setConnecting(true);

    try {
      await connect();
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setConnecting(false);
    }
  }, [connect]);

  useEffect(() => {
    if (initiateConnectionFlag && pgState.openaiAPIKey) {
      (async () => initiateConnection())();
      setInitiateConnectionFlag(false);
    }
  }, [initiateConnectionFlag, initiateConnection, pgState.openaiAPIKey]);

  return (
    <button
      onClick={handleConnectionToggle}
      disabled={connecting || shouldConnect}
      className="
        flex items-center justify-center border-[1px] rounded-full
        w-[77.6px] h-[77.6px] relative disabled:opacity-40
      "
    >
      {connecting || shouldConnect ? (
        <>
          <Loader2 className="h-[30px] w-[30px] animate-spin text-main absolute" />
        </>
      ) : (
        <>
          <img src={`${MicrophoneIcon}`} alt="microphone" />
        </>
      )}
    </button>
  );
};