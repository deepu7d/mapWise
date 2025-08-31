"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import useSocket from "@/hooks/useSocket";
import { Destination, User } from "@/types";
import { Share2 } from "lucide-react";
import UserCards from "@/components/UserCards";
import ChatSection from "@/components/ChatSection";
import { sessionData } from "@repo/types";

export default function PlaygroundPage() {
  const params = useParams();
  const roomId = params.id as string;

  const [users, setUsers] = useState<User[]>([]);
  const [sessionData, setSessionData] = useState<sessionData | null>(null);
  const currentPositionRef = useRef<[number, number] | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const socket = useSocket("http://localhost:8000/");

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

  useEffect(() => {
    if (!socket || !sessionData) return;

    const handleConnect = () => {
      socket.emit("joinRoom", {
        userId: sessionData.userId,
        roomId: sessionData.roomId,
      });
      // setUsers((prev) => [
      //   ...prev,
      //   {
      //     id: sessionData.userId,
      //     name: sessionData.username,
      //     position: [1, 2],
      //   },
      // ]);
    };

    const handleCurrentUsers = (allUsers: User[]) => {
      console.log(allUsers);
      setUsers(allUsers);
    };

    const handleNewUser = (newUser: User) => {
      console.log("New User", newUser);
      // Add user only if they don't already exist
      setUsers((prev) =>
        prev.some((u) => u.id === newUser.id) ? prev : [...prev, newUser]
      );
    };

    const handleLocationUpdate = (updatedUser: {
      id: string;
      position: [number, number];
    }) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === updatedUser.id
            ? { ...user, position: updatedUser.position }
            : user
        )
      );
    };

    const handleUserDisconnected = (userId: string) => {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    };

    socket.on("connect", handleConnect);
    socket.on("newUser", handleNewUser);
    socket.on("currentUsers", handleCurrentUsers);
    socket.on("locationUpdate", handleLocationUpdate);
    socket.on("userDisconnected", handleUserDisconnected);

    // --- SENDING your location ---
    // const watchId = navigator.geolocation.watchPosition(
    //   (position) => {
    //     const { latitude, longitude } = position.coords;
    //     currentPositionRef.current = [latitude, longitude];
    //   },
    //   (error) => console.error("Geolocation error:", error),
    //   { enableHighAccuracy: true, timeout: 5000 }
    // );

    if (currentPositionRef.current) {
      socket.emit("updateLocation", {
        name: sessionData.username,
        position: currentPositionRef.current,
      });
    }

    return () => {
      console.log("Cleaning up listeners and intervals...");
      // navigator.geolocation.clearWatch(watchId);

      // Remove all listeners to prevent duplicate events on re-render
      socket.off("connect", handleConnect);
      socket.off("newUser", handleNewUser);
      socket.off("currentUsers", handleCurrentUsers);
      socket.off("locationUpdate", handleLocationUpdate);
      socket.off("userDisconnected", handleUserDisconnected);
    };
  }, [socket, roomId]);

  const link = `${roomId}`;
  const handleCopy = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.log("failed to copy", err);
      });
  };

  if (!sessionData) return <h1>Fetching session data</h1>;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 gap-2 h-dvh overflow-hidden w-full">
      <div className="text-center w-full h-[10%] max-w-5xl">
        <div className="flex items-center justify-center gap-x-4 rounded-lg">
          <p className="w-[80%] lg:w-fit truncate text-sm text-gray-600 font-bold">
            {link}
          </p>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 bg-blue-500 rounded-xl text-white font-bold p-2 hover:bg-blue-600"
          >
            {isCopied ? "copied" : <Share2 />}
          </button>
        </div>
        <p className="text-xs text-gray-600 truncate">
          Destination: {sessionData.destinationName}
        </p>
      </div>
      <div className="h-[30%] w-full max-w-5xl border-2 border-gray-300 rounded-lg overflow-hidden m-auto">
        <Map
          users={users}
          destination={{
            name: sessionData.destinationName,
            position: sessionData.destinationPosition,
          }}
        />
      </div>
      <div className="w-full h-[10%] max-w-5xl">
        <UserCards users={users} currentSocketId={sessionData.userId} />
      </div>
      <div className="w-full h-[50%] max-w-5xl">
        <ChatSection socket={socket} sessionData={sessionData} />
      </div>
    </main>
  );
}
