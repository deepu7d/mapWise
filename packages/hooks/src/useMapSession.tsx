"use client";

import { useEffect, useRef } from "react";
import { Position, sessionData, User } from "@repo/types";
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

  useEffect(() => {
    if (!socket || !sessionData) return;

    const handleCurrentUsers = (currentUsers: User[]) => {
      currentUsers.map((user: User) => dispatch(addUser(user)));
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

    return () => {
      console.log("Cleaning up listeners and intervals...");

      socket.off("newUser", handleNewUser);
      socket.off("currentUsers", handleCurrentUsers);
      socket.off("location-update", handleLocationUpdate);
      socket.off("user-disconneted", handleUserDisconnected);
    };
  }, [socket, sessionData, dispatch]);

  return socket;
}
