"use client";

import { useEffect, useState } from "react";
import RoomForm from "@/components/Form/RoomForm";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Destination, sessionData } from "@repo/types";
import { getCurrentLocation } from "@/helper/helperFunctions";
import { motion } from "motion/react";
import toast from "react-hot-toast";

type formData = {
  name: string;
  roomId?: string;
  destination?: Destination;
};

export default function MainForm() {
  const searchParams = useSearchParams();
  const roomParam = searchParams.get("roomId");
  const adminParam = searchParams.get("admin");

  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(adminParam === "true");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsAdmin(adminParam === "true");
  }, [adminParam]);

  const handleFormSubmit = async (data: formData) => {
    setIsLoading(true);
    try {
      const userPosition = await getCurrentLocation();
      let response;

      try {
        if (isAdmin) {
          response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/room/create-room`,
            {
              username: data.name,
              destination: {
                name: data.destination?.name,
                position: data.destination?.position,
              },
              userPosition: userPosition,
            }
          );
        } else {
          response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/room/join/${data.roomId}`,
            {
              username: data.name,
              position: userPosition,
            }
          );
        }

        if (response && response.data) {
          const sessionData: sessionData = response.data;
          sessionStorage.setItem("session-cookie", JSON.stringify(sessionData));
          toast.success("Redirecting to room...");
          router.push(`playground/${sessionData.roomId}`);
        } else {
          console.error("Failed to get a valid response from the server.");
        }
      } catch (axiosError) {
        // Handle axios errors
        let errorMessage = "An error occurred. Please try again.";

        if (axios.isAxiosError(axiosError)) {
          errorMessage =
            axiosError.response?.data?.message || axiosError.message;
        } else if (axiosError instanceof Error) {
          errorMessage = axiosError.message;
        }

        toast.error(errorMessage, {
          duration: 1000,
        });
        console.error("An error occurred during API request:", axiosError);
      }
    } catch (geoError) {
      // Handle geolocation errors
      let errorMessage =
        "Failed to get your location. Please enable location services.";

      if (geoError instanceof GeolocationPositionError) {
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case geoError.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
      } else if (geoError instanceof Error) {
        errorMessage = geoError.message;
      }

      toast.error(errorMessage);
      console.error("Geolocation error:", geoError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <nav className="flex -mb-px space-x-6">
          <button
            onClick={() => {
              setIsAdmin(true);
              router.replace("/form?admin=true");
            }}
            className={`p-4 font-medium text-md rounded-t-md ${
              isAdmin ? " text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>Create Room</span>
            {isAdmin && (
              <motion.div
                layoutId="underline"
                className="border-b-2 border-blue-600 "
              />
            )}
          </button>
          <button
            onClick={() => {
              setIsAdmin(false);
              router.replace("/form?admin=false");
            }}
            className={`px-3 py-2 font-medium text-md rounded-t-md ${
              !isAdmin ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>Join Room</span>
            {!isAdmin && (
              <motion.div
                layoutId="underline"
                className="border-b-2 border-blue-500 "
              />
            )}
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
