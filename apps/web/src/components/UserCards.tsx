"use client";

import { User } from "@/types";
import React from "react";
import Card from "./Card";

type UserCardsProps = {
  users: User[];
  currentSocketId: string | null;
};

const UserCards = ({ users, currentSocketId }: UserCardsProps) => {
  return (
    <div className="w-full max-w-sm rounded-lg h-full">
      <h1 className="text-gray-800 font-bold text-lg mb-1">Room Members</h1>
      {users.length > 0 ? (
        <ul className="flex gap-2 overflow-x-auto mx-1">
          {users.map((user) => (
            <Card
              key={user.id}
              user={user}
              isCurrent={user.id == currentSocketId}
            />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">Waiting for other users...</p>
      )}
    </div>
  );
};

export default UserCards;
