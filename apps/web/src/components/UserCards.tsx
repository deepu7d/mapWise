"use client";

import React from "react";
import Card from "./Card";
import { User } from "@repo/types";
import { useAppSelector } from "@/redux/hooks";
import { Tooltip } from "react-tooltip";

type UserCardsProps = {
  users: User[];
  currentSocketId: string | null;
};

const UserCards = ({ currentSocketId }: UserCardsProps) => {
  const users = useAppSelector((state) => state.users);

  return (
    <div className="w-full max-w-sm rounded-lg h-full">
      <h1 className="text-gray-800 font-bold text-lg mb-1">Room Members</h1>
      {users.length > 0 ? (
        <ul className="flex gap-2 overflow-x-auto mx-1">
          {users.map((user, index) => {
            return (
              <Card
                index={index}
                key={user.id}
                user={user}
                isCurrent={user.id == currentSocketId}
              />
            );
          })}
          <Tooltip id="my-tooltip"></Tooltip>
        </ul>
      ) : (
        <p className="text-center text-gray-500">Waiting for other users...</p>
      )}
    </div>
  );
};

export default UserCards;
