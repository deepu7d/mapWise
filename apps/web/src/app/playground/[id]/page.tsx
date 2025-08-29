"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import useSocket from "@/hooks/useSocket";
import ChatBar from "@/components/ChatSection";
import { Destination, User } from "@/types";
import { Share2 } from "lucide-react";
import UserCards from "@/components/UserCards";
import ChatSection from "@/components/ChatSection";

export default function PlaygroundPage() {
  const params = useParams();
  const roomId = params.id as string;

  const [users, setUsers] = useState<User[]>([]);
  const [currentSocketId, setCurrentSocketId] = useState<string | null>(null);
  const [roomDestination, setRoomDestination] = useState<Destination | null>(
    null
  );

  const currentPositionRef = useRef<[number, number] | null>(null);
  const userNameRef = useRef<string>("");

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
    if (!socket || !roomId) return;

    const handleConnect = () => {
      setCurrentSocketId(socket.id || "");
      localStorage.setItem("socketId", socket.id || "");
      const storedData = JSON.parse(localStorage.getItem("roomData") || "{}");
      userNameRef.current = storedData.name || "Anonymous";
      // navigator.geolocation.getCurrentPosition(
      //   (position) => {
      //     console.log(position);
      //     const { latitude, longitude } = position.coords;
      currentPositionRef.current = [30.359342333333334, 76.78869633333335];

      socket.emit("joinRoom", {
        roomId: roomId,
        name: userNameRef.current,
        destination: storedData.destination,
        position: [30.359342333333334, 76.78869633333335],
      });
      //   },
      //   (error) => {
      //     console.error("Failed to get initial location:", error);
      //     alert(
      //       "Could not get your location. Please enable location services and refresh."
      //     );
      //   },
      //   { enableHighAccuracy: false }
      // );
    };

    const handleRoomData = (data: Destination) => {
      setRoomDestination(data);
    };

    const handleCurrentUsers = (allUsers: User[]) => {
      // Set the state with the full list of users
      setUsers(allUsers);
    };

    const handleNewUser = (newUser: User) => {
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
    socket.on("roomData", handleRoomData);

    socket.on("newUser", handleNewUser);
    socket.on("currentUsers", handleCurrentUsers);
    socket.on("locationUpdate", handleLocationUpdate);
    socket.on("userDisconnected", handleUserDisconnected);

    // --- SENDING your location ---
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        currentPositionRef.current = [latitude, longitude];
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, timeout: 5000 }
    );

    if (currentPositionRef.current && userNameRef.current) {
      socket.emit("updateLocation", {
        name: userNameRef.current,
        position: currentPositionRef.current,
      });
    }

    return () => {
      console.log("Cleaning up listeners and intervals...");
      navigator.geolocation.clearWatch(watchId);

      // Remove all listeners to prevent duplicate events on re-render
      socket.off("connect", handleConnect);
      socket.off("roomData", handleRoomData);
      socket.off("newUser", handleNewUser);
      socket.off("locationUpdate", handleLocationUpdate);
      socket.off("userDisconnected", handleUserDisconnected);
    };
  }, [socket, roomId]);

  if (!roomDestination) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1>Fetching Room Destination</h1>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 gap-2 h-dvh overflow-hidden">
      <div className="text-center w-full h-[10%]">
        <div className="flex items-center justify-start gap-x-4 rounded-lg">
          <p className="w-[80%] truncate text-sm text-gray-600 font-bold">
            https://qs9pjlmq-3000.inc1.devtunnels.ms/playground/{roomId}
          </p>
          <button className="flex-shrink-0 bg-blue-500 rounded-xl text-white font-bold p-2 hover:bg-blue-600">
            <Share2 />
          </button>
        </div>
        <p className="text-xs text-gray-600 truncate">
          Destination: {roomDestination.name}
        </p>
      </div>
      <div className="h-[30%] w-full max-w-5xl border-2 border-gray-300 rounded-lg overflow-hidden">
        <Map
          users={users}
          destination={{
            name: roomDestination.name,
            position: roomDestination.position,
          }}
        />
      </div>
      <div className="w-full h-[10%]">
        <UserCards users={users} currentSocketId={currentSocketId} />
      </div>
      <div className="w-full h-[50%]">
        <ChatSection socket={socket} />
      </div>
    </main>
  );
}
