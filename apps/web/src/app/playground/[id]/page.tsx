"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { sessionData, User } from "@repo/types";
import Navbar from "@/components/Navbar";
import { SocketProvider } from "@repo/hooks";
import Screens from "@/components/Screens";
import { toast } from "react-hot-toast";

export default function PlaygroundPage() {
  const params = useParams<{ id: string }>();
  const roomId = params.id;

  const [sessionData, setSessionData] = useState<sessionData | null>(null);

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

  const userOnlineToast = ({ newUser }: { newUser: User }) => {
    toast(
      <span>
        <span className="font-bold">
          {newUser.id == sessionData?.userId ? "You" : newUser.name}
        </span>{" "}
        Joined
      </span>,
      {
        icon: "🧑🏻",
        className: "border border-solid border-black p-4 rounded-md bg-white",
      }
    );
  };

  const userOfflineToast = ({ username }: { username: string }) => {
    toast(
      <span>
        <span className="font-bold">{username}</span> Offline
      </span>,
      {
        icon: "☹️",
        className: "border border-solid border-black p-4 rounded-md bg-white",
      }
    );
  };

  return (
    <SocketProvider
      sessionData={sessionData}
      apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}
      userOnlineToast={userOnlineToast}
      userOfflineToast={userOfflineToast}
    >
      <main className="flex h-dvh flex-col items-center overflow-hidden w-full justify-center max-w-xl mx-auto bg-white border border-gray-200 shadow-md">
        <Navbar roomId={roomId} />
        <Screens sessionData={sessionData} />
      </main>
    </SocketProvider>
  );
}
