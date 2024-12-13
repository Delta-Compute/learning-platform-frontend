import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

import { useMediaDeviceSelect } from "@livekit/components-react";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

export const SessionControls = () => {
  const deviceSelect = useMediaDeviceSelect({ kind: "audioinput" });

  return (
    <>
      <Listbox>
        <ListboxButton className="grid cursor-default grid-cols-1 rounded-md bg-gray-100 py-[12px] px-[14px]">
          <ChevronDownIcon
            className="size-5 text-gray-800"
          />
        </ListboxButton>
        <div className="relative">
          <ListboxOptions
            transition
            className="bottom-[60px] absolute border-[1px] rounded bg-white"
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
    </>
  );
};