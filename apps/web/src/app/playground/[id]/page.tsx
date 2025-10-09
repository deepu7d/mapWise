"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import UserCards from "@/components/UserCards";
import ChatSection from "@/components/ChatSection";
import { sessionData } from "@repo/types";
import useRoomSession from "@/hooks/useMapSession";
import useSocket from "@/hooks/useSocket";
import useJoinRoom from "@/hooks/useJoinRoom";
import Navbar from "@/components/Navbar";
import TabBar from "@/components/TabBar";

export type tabType = "map" | "users" | "chat";
export default function PlaygroundPage() {
  const params = useParams<{ id: string }>();
  const roomId = params.id;

  const [sessionData, setSessionData] = useState<sessionData | null>(null);
  const [currentTab, setCurrentTab] = useState<tabType>("map");

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        loading: () => <p className="text-center">A map is loading...</p>,
        ssr: false,
      }),
    []
  );

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
    <main className="flex min-h-screen flex-col items-center p-4 gap-2 h-dvh overflow-hidden w-full">
      <Navbar roomId={roomId} />
      <div className="h-full w-full">
        {currentTab == "map" && (
          <Map
            destination={{
              name: sessionData.destinationName,
              position: sessionData.destinationPosition,
            }}
            currentUser={sessionData.userId}
          />
        )}

        {currentTab == "users" && (
          <UserCards currentSocketId={sessionData.userId} />
        )}
        {currentTab == "chat" && (
          <ChatSection socket={socket} sessionData={sessionData} />
        )}
      </div>
      <TabBar setCurrentTab={setCurrentTab} />
    </main>
  );
}
