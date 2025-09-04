"use client";

import { useEffect, useState } from "react";
import RoomForm from "@/components/RoomForm";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Destination, sessionData } from "@repo/types";
import { getCurrentLocation } from "@/helper/helperFunctions";

const API_BASE_URL = "https://qs9pjlmq-8000.inc1.devtunnels.ms";

type formData = {
  name: string;
  roomId?: string;
  destination?: Destination;
};

export default function HomePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParam = useSearchParams();
  const roomParam = searchParam.get("roomId");

  const handleFormSubmit = async (data: formData) => {
    setIsLoading(true);

    const userPosition = await getCurrentLocation();

    if (isAdmin) {
      const response = await axios.post(
        `${API_BASE_URL}/api/room/create-room`,
        {
          username: data.name,
          destination: {
            name: data.destination?.name,
            position: data.destination?.position,
          },
          userPosition: userPosition,
        }
      );
      if (!response) console.log("ERROR CREATING ROOM");
      const sessionData: sessionData = response.data;

      sessionStorage.setItem("session-cookie", JSON.stringify(sessionData));
      router.push(`playground/${sessionData.roomId}`);
    } else {
      const response = await axios.post(
        `${API_BASE_URL}/api/room/join/${data.roomId}`,
        {
          username: data.name,
          position: userPosition,
        }
      );
      if (!response) console.log("ERROR CREATING ROOM");
      console.log(response);
      const sessionData: sessionData = response.data;
      sessionStorage.setItem("session-cookie", JSON.stringify(sessionData));
      router.push(`playground/${sessionData.roomId}`);
    }
    setIsLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex -mb-px space-x-6">
          <button
            onClick={() => setIsAdmin(true)}
            className={`px-3 py-2 font-medium text-sm rounded-t-md ${
              isAdmin
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => setIsAdmin(false)}
            className={`px-3 py-2 font-medium text-sm rounded-t-md ${
              !isAdmin
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Join Room
          </button>
        </nav>
      </div>

      <RoomForm
        isAdmin={isAdmin}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        roomParam={roomParam}
      />
    </main>
  );
}
