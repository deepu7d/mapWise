"use client";

import { useState } from "react";
import RoomForm from "@/components/RoomForm";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Destination, sessionData } from "@repo/types";
import { getCurrentLocation } from "@/helper/helperFunctions";

const API_BASE_URL = "https://qs9pjlmq-8000.inc1.devtunnels.ms";

type formData = {
  name: string;
  roomId?: string;
  destination?: Destination;
};

export default function MainForm() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // useSearchParams is now safely inside a dedicated client component
  const searchParams = useSearchParams();
  const roomParam = searchParams.get("roomId");

  const handleFormSubmit = async (data: formData) => {
    setIsLoading(true);
    try {
      const userPosition = await getCurrentLocation();
      let response;

      if (isAdmin) {
        response = await axios.post(`${API_BASE_URL}/api/room/create-room`, {
          username: data.name,
          destination: {
            name: data.destination?.name,
            position: data.destination?.position,
          },
          userPosition: userPosition,
        });
      } else {
        response = await axios.post(
          `${API_BASE_URL}/api/room/join/${data.roomId}`,
          {
            username: data.name,
            position: userPosition,
          }
        );
      }

      if (response && response.data) {
        const sessionData: sessionData = response.data;
        sessionStorage.setItem("session-cookie", JSON.stringify(sessionData));
        router.push(`playground/${sessionData.roomId}`);
      } else {
        console.error("Failed to get a valid response from the server.");
      }
    } catch (error) {
      console.error("An error occurred during form submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
    </>
  );
}
