"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import UserCards from "@/components/UserCard/UserCards";
import ChatSection from "@/components/ChatSection";
import { sessionData } from "@repo/types";
import Navbar from "@/components/Navbar";
import TabBar from "@/components/TabBar";
import MapLibre from "@/components/Map/Map";
import { motion } from "motion/react";
import { SocketProvider } from "@repo/hooks";

export type tabType = "map" | "users" | "chat";
export default function PlaygroundPage() {
  const params = useParams<{ id: string }>();
  const roomId = params.id;

  const [sessionData, setSessionData] = useState<sessionData | null>(null);
  const [currentTab, setCurrentTab] = useState<tabType>("map");

  useEffect(() => {
    const sessionString = sessionStorage.getItem("session-cookie");
    if (!sessionString) return;

    setSessionData(JSON.parse(sessionString));
  }, []);

  if (!sessionData) {
    return (
      <h1 className="h-dvh w-full flex justify-center items-center text-3xl">
        Loading....
      </h1>
    );
  }

  return (
    <SocketProvider
      sessionData={sessionData}
      apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}
    >
      <main className="flex h-dvh flex-col items-center overflow-hidden w-full justify-center max-w-xl mx-auto bg-white border border-gray-200 shadow-md">
        <Navbar roomId={roomId} />
        <motion.div
          animate={currentTab === "map" ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`h-full w-full ${currentTab != "map" ? "hidden" : "block"}`}
        >
          <MapLibre sessionData={sessionData} />
        </motion.div>
        <motion.div
          animate={currentTab === "users" ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`h-full w-full ${currentTab != "users" ? "hidden" : "block"} overflow-x-auto`}
        >
          <UserCards currentSocketId={sessionData.userId} />
        </motion.div>
        <motion.div
          animate={currentTab === "chat" ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`h-full w-full ${currentTab != "chat" ? "hidden" : "block"} overflow-x-auto`}
        >
          <ChatSection sessionData={sessionData} />
        </motion.div>
        <TabBar setCurrentTab={setCurrentTab} currentTab={currentTab} />
      </main>
    </SocketProvider>
  );
}
