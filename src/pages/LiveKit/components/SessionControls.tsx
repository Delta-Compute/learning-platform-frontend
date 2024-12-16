import { useState, useEffect } from "react";

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

import {
  TrackToggle,
  useLocalParticipant,
  useMediaDeviceSelect,
} from "@livekit/components-react";
import { Track } from "livekit-client";

import { useMultibandTrackVolume } from "../hooks";

import { MultibandAudioVisualizer } from "../components";

import { CheckIcon, ChevronDownIcon, Mic, MicOff } from "lucide-react";

export const SessionControls = () => {
  const localParticipant = useLocalParticipant();
  const deviceSelect = useMediaDeviceSelect({ kind: "audioinput" });

  const [isMuted, setIsMuted] = useState(localParticipant.isMicrophoneEnabled);

  const localMultibandVolume = useMultibandTrackVolume(
    localParticipant.microphoneTrack?.track,
    9,
  );

  useEffect(() => {
    setIsMuted(localParticipant.isMicrophoneEnabled === false);
  }, [localParticipant.isMicrophoneEnabled]);

  return (
    <div className="flex">
      <div className="bg-gray-100 rounded-l-md flex items-center">
        <TrackToggle
          source={Track.Source.Microphone}
          className={`${
            isMuted ? " opacity-50" : ""
          }`}
          showIcon={false}
        >
          {isMuted ? (
            <MicOff size={15} />
          ) : (
            <Mic size={15} />
          )}
        </TrackToggle>

        <MultibandAudioVisualizer
          state="speaking"
          barWidth={2}
          minBarHeight={2}
          maxBarHeight={16}
          frequencies={localMultibandVolume}
          borderRadius={5}
          gap={2}
        />
      </div>
      <Listbox>
        <ListboxButton className="grid cursor-default grid-cols-1 rounded-r-md bg-gray-100 py-[12px] px-[14px]">
          <ChevronDownIcon
            className="text-gray-800"
            size={15}
          />
        </ListboxButton>
        <div className="relative">
          <ListboxOptions
            transition
            className="bottom-[50px] absolute border-[1px] left-[-60px] rounded bg-white"
          >
            {deviceSelect.devices.map((device) => (
              <ListboxOption
                key={device.deviceId}
                value={device}
                className="group relative cursor-default select-none py-2 px-3 w-[240px] text-gray-900 flex items-center justify-between gap-2"
                onClick={() => deviceSelect.setActiveMediaDevice(device.deviceId)}
              >
                <div className="flex items-center gap-2">
                  <span className="block text-xs font-normal">
                    {device.label}
                  </span>
                </div>

                <span>
                  {device.deviceId === deviceSelect.activeDeviceId && <CheckIcon className="size-4 text-main" />}
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};