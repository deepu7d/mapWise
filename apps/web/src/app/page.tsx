"use client";

import { useState } from "react";
import RoomForm from "@/components/RoomForm";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { Destination } from "@/types";
import { cookieName } from "@/helper/constant";

type formData = {
  name: string;
  roomId?: string;
  destination?: Destination;
};

export default function HomePage() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = (data: formData) => {
    setIsLoading(true);
    if (isAdmin) {
      const roomId = nanoid(6);
      localStorage.setItem(
        cookieName,
        JSON.stringify({
          name: data.name,
          destination: data.destination,
        })
      );
      router.push(`/playground/${roomId}`);
    } else {
      localStorage.setItem(
        cookieName,
        JSON.stringify({
          name: data.name,
        })
      );
      router.push(`/playground/${data.roomId}`);
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
      />
    </main>
  );
}
