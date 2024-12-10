import {
  ControlBar,
  LiveKitRoom,
  RoomAudioRenderer,
  // GridLayout,
  // ParticipantTile,
  // useTracks,
} from "@livekit/components-react";

import "@livekit/components-styles";

// import { Track } from "livekit-client";

const serverUrl = "";
const token = "";

export const LiveKitConversation = () => {
  return (
    <div>
      <p>live kit room</p>
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: "100vh" }}
      >
        <RoomAudioRenderer />
        <ControlBar />
      </LiveKitRoom>
    </div>
  );
};

// function MyVideoConference() {
//   const tracks = useTracks(
//     [
//       { source: Track.Source.Camera, withPlaceholder: true },
//       { source: Track.Source.ScreenShare, withPlaceholder: false },
//     ],
//     { onlySubscribed: false },
//   );
//   return (
//     <GridLayout tracks={tracks} style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}>
//       <ParticipantTile />
//     </GridLayout>
//   );
// }