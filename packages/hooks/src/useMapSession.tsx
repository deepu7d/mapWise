"use client";

import { useEffect, useRef } from "react";
import { sessionData, User } from "@repo/types";
import { addUser, updateUserPosition, userOffline } from "@repo/store";
import { useAppDispatch } from "@repo/store";
import { Socket } from "socket.io-client";

export function useMapSession(
  sessionData: sessionData | null,
  socket: Socket | null,
  userOnlineToast?: ({ newUser }: { newUser: User }) => void,
  userOfflineToast?: ({ username }: { username: string }) => void
): Socket | null {
  const dispatch = useAppDispatch();

  const currentPositionRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (!socket || !sessionData) return;

    const handleCurrentUsers = (currentUsers: User[]) => {
      console.log("Received current users:");
      currentUsers.map((user: User) => dispatch(addUser(user)));
      console.log("Dispatched current users to store");
    };

    const handleNewUser = (newUser: User) => {
      userOnlineToast?.({ newUser });
      dispatch(addUser(newUser));
    };

    const handleLocationUpdate = (updatedUser: {
      id: string;
      position: [number, number];
    }) => {
      dispatch(updateUserPosition(updatedUser));
    };

    const handleUserDisconnected = (disconnetedUser: User) => {
      userOfflineToast?.({ username: disconnetedUser.name });
      dispatch(userOffline({ id: disconnetedUser.id }));
    };

    socket.on("currentUsers", handleCurrentUsers);
    socket.on("newUser", handleNewUser);
    socket.on("location-update", handleLocationUpdate);
    socket.on("user-disconneted", handleUserDisconnected);

    // const watchId = navigator.geolocation.watchPosition(
    //   (position) => {
    //     const { latitude, longitude } = position.coords;
    //     currentPositionRef.current = [latitude, longitude];
    //     dispatch(
    //       updateUserPosition({
    //         id: sessionData.userId,
    //         position: [latitude, longitude],
    //       })
    //     );
    //   },
    //   (error) => console.error("Geolocation error:", error),
    //   { enableHighAccuracy: true }
    // );

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
      // navigator.geolocation.clearWatch(watchId);
      clearInterval(intervalId);

      socket.off("newUser", handleNewUser);
      socket.off("currentUsers", handleCurrentUsers);
      socket.off("location-update", handleLocationUpdate);
      socket.off("user-disconneted", handleUserDisconnected);
    };
  }, [socket, , sessionData, dispatch]);

  return socket;
}
