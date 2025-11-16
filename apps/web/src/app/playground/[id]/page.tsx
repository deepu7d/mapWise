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
      <h1 className="flex h-dvh w-full items-center justify-center text-3xl">
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
      },
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
      },
    );
  };

  return (
    <SocketProvider
      sessionData={sessionData}
      apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}
      userOnlineToast={userOnlineToast}
      userOfflineToast={userOfflineToast}
    >
      <main className="mx-auto flex h-dvh w-full max-w-xl flex-col items-center justify-center overflow-hidden border border-gray-200 bg-white shadow-md">
        <Navbar roomId={roomId} />
        <Screens sessionData={sessionData} />
      </main>
    </SocketProvider>
  );
}
