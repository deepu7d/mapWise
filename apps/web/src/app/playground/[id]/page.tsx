"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import useSocket from "@/hooks/useSocket";
import { Share2 } from "lucide-react";
import UserCards from "@/components/UserCards";
import ChatSection from "@/components/ChatSection";
import { sessionData, User } from "@repo/types";
import {
  addUser,
  updateUserPosition,
  userOffline,
} from "@/redux/features/users/usersSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import toast from "react-hot-toast";

const API_URL = "https://qs9pjlmq-8000.inc1.devtunnels.ms";
const CLIENT_URL = "https://qs9pjlmq-3000.inc1.devtunnels.ms/";
export default function PlaygroundPage() {
  const params = useParams();
  const roomId = params.id as string;

  const users = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const [sessionData, setSessionData] = useState<sessionData | null>(null);
  const currentPositionRef = useRef<[number, number] | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const socket = useSocket(API_URL);

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
    };

    const handleCurrentUsers = (currentUsers: User[]) => {
      currentUsers.map((user: User) => dispatch(addUser(user)));
    };

    const handleNewUser = (newUser: User) => {
      toast(
        <span>
          <span className="font-bold">
            {newUser.id == sessionData.userId ? "You" : newUser.name}
          </span>{" "}
          Joined
        </span>,
        {
          icon: "🧑🏻",
          className: "border border-solid border-black p-4 rounded-md bg-white",
        }
      );
      dispatch(addUser(newUser));
    };

    const handleLocationUpdate = (updatedUser: {
      id: string;
      position: [number, number];
    }) => {
      dispatch(updateUserPosition(updatedUser));
    };

    const handleUserDisconnected = ({
      id,
      username,
    }: {
      id: string;
      username: string;
    }) => {
      toast(
        <span>
          <span className="font-bold">{username}</span> Offline
        </span>,
        {
          icon: "☹️",
          className: "border border-solid border-black p-4 rounded-md bg-white",
        }
      );
      dispatch(userOffline({ id }));
    };

    socket.on("connect", handleConnect);
    socket.on("currentUsers", handleCurrentUsers);
    socket.on("newUser", handleNewUser);
    socket.on("location-update", handleLocationUpdate);
    socket.on("user-disconneted", handleUserDisconnected);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        currentPositionRef.current = [latitude, longitude];
        dispatch(
          updateUserPosition({
            id: sessionData.userId,
            position: [latitude, longitude],
          })
        );
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true }
    );

    const intervalId = setInterval(() => {
      if (currentPositionRef.current) {
        socket.emit("updateLocation", {
          userId: sessionData.userId,
          position: currentPositionRef.current,
        });
      }
    }, 3000);

    return () => {
      console.log("Cleaning up listeners and intervals...");
      navigator.geolocation.clearWatch(watchId);
      clearInterval(intervalId);
      socket.off("connect", handleConnect);
      socket.off("newUser", handleNewUser);
      socket.off("currentUsers", handleCurrentUsers);
      socket.off("locationUpdate", handleLocationUpdate);
      socket.off("user-disconneted", handleUserDisconnected);
    };
  }, [socket, roomId, sessionData, dispatch]);

  const link = `${CLIENT_URL}?roomId=${roomId}`;
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

  if (!sessionData || !socket) {
    return (
      <h1 className="h-dvh w-full flex justify-center items-center text-3xl">
        Loading....
      </h1>
    );
  }

  // const handleManualUpdate = () => {
  //   if (!currentPositionRef.current || !sessionData || !socket) return;
  //   toast.success("BUtton clicked");

  //   // Get current position as default values for the prompts
  //   const [currentLat, currentLng] = currentPositionRef.current;

  //   // Prompt for new latitude
  //   const latInput = prompt("Enter new Latitude:", currentLat.toString());
  //   // If user cancels, stop the function
  //   if (latInput === null) return;

  //   // Prompt for new longitude
  //   const lngInput = prompt("Enter new Longitude:", currentLng.toString());
  //   // If user cancels, stop the function
  //   if (lngInput === null) return;

  //   // Convert inputs to numbers
  //   const newLat = parseFloat(latInput);
  //   const newLng = parseFloat(lngInput);

  //   // Check if the inputs are valid numbers and emit
  //   if (!isNaN(newLat) && !isNaN(newLng)) {
  //     socket.emit("updateLocation", {
  //       userId: sessionData.userId,
  //       position: [newLat, newLng],
  //     });
  //     dispatch(
  //       updateUserPosition({
  //         id: sessionData.userId,
  //         position: [newLat, newLng],
  //       })
  //     );
  //   } else {
  //     alert("Invalid input. Please enter numbers only.");
  //   }
  // };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 gap-2 h-dvh overflow-hidden w-full">
      <div className="text-center w-full h-[5%] max-w-5xl">
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
        {/* <p className="text-xs text-gray-600 truncate">
          Destination: {sessionData.destinationName}
        </p> */}
      </div>
      <div className="h-[35%] w-full max-w-5xl border-2 border-gray-300 rounded-lg overflow-hidden m-auto">
        <Map
          destination={{
            name: sessionData.destinationName,
            position: sessionData.destinationPosition,
          }}
          currentUser={sessionData.userId}
        />
      </div>
      {/* <div className="text-center my-2">
        <button
          onClick={handleManualUpdate}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600"
        >
          Manually Update Location
        </button>
      </div> */}
      <div className="w-full h-[10%] max-w-5xl no-select no-highlight">
        <UserCards users={users} currentSocketId={sessionData.userId} />
      </div>
      <div className="w-full h-[50%] max-w-5xl">
        <ChatSection socket={socket} sessionData={sessionData} />
      </div>
    </main>
  );
}
