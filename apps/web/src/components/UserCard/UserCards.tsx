"use client";

import React from "react";
import Card from "./Card";
import { useAppSelector } from "@/redux/hooks";
import { Tooltip } from "react-tooltip";

type UserCardsProps = {
  currentSocketId: string | null;
};

const UserCards = ({ currentSocketId }: UserCardsProps) => {
  const users = useAppSelector((state) => state.users);

  return (
    <div className="w-full rounded-lg max-w-5xl no-select no-highlight overflow-x-auto h-full px-4">
      {users.length > 0 ? (
        <ul className="flex flex-wrap gap-2 ">
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
