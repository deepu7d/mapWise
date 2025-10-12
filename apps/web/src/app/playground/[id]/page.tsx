"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import UserCards from "@/components/UserCard/UserCards";
import ChatSection from "@/components/ChatSection";
import { sessionData } from "@repo/types";
import useRoomSession from "@/hooks/useMapSession";
import useSocket from "@/hooks/useSocket";
import useJoinRoom from "@/hooks/useJoinRoom";
import Navbar from "@/components/Navbar";
import TabBar from "@/components/TabBar";
import MapLibre from "@/components/Map/Map";

export type tabType = "map" | "users" | "chat";
export default function PlaygroundPage() {
  const params = useParams<{ id: string }>();
  const roomId = params.id;

  const [sessionData, setSessionData] = useState<sessionData | null>(null);
  const [currentTab, setCurrentTab] = useState<tabType>("map");

  // const Map = useMemo(
  //   () =>
  //     dynamic(() => import("@/components/Map"), {
  //       loading: () => <p className="text-center">A map is loading...</p>,
  //       ssr: false,
  //     }),
  //   []
  // );

  useEffect(() => {
    const sessionString = sessionStorage.getItem("session-cookie");
    if (!sessionString) return;

    setSessionData(JSON.parse(sessionString));
  }, []);

  const socket = useSocket(process.env.NEXT_PUBLIC_API_BASE_URL || "");

  useJoinRoom(socket, sessionData);
  useRoomSession(sessionData, roomId, socket);

  if (!sessionData || !socket) {
    return (
      <h1 className="h-dvh w-full flex justify-center items-center text-3xl">
        Loading....
      </h1>
    );
  }

  return (
    <main className="flex h-dvh flex-col items-center overflow-hidden w-full justify-center max-w-xl mx-auto bg-white">
      <Navbar roomId={roomId} />
      <div
        className={`h-full w-full ${currentTab != "map" ? "hidden" : "block"}`}
      >
        <MapLibre
          destination={{
            name: sessionData.destinationName,
            position: sessionData.destinationPosition,
          }}
          currentUser={sessionData.userId}
        />
        {/* <Map
          destination={{
            name: sessionData.destinationName,
            position: sessionData.destinationPosition,
          }}
          currentUser={sessionData.userId}
        /> */}
      </div>
      <div
        className={`h-full w-full ${currentTab != "users" ? "hidden" : "block"} overflow-x-auto`}
      >
        <UserCards currentSocketId={sessionData.userId} />
      </div>
      <div
        className={`h-full w-full ${currentTab != "chat" ? "hidden" : "block"} overflow-x-auto`}
      >
        <ChatSection socket={socket} sessionData={sessionData} />
      </div>
      <TabBar setCurrentTab={setCurrentTab} currentTab={currentTab} />
    </main>
  );
}
