"use client";

import React from "react";
import Card from "./card";
import { useAppSelector } from "@repo/store";
import { Tooltip } from "react-tooltip";
export default function StatsCards({
  currentSocketId,
}: {
  currentSocketId: string | null;
}) {
  const users = useAppSelector((state) => state.users);

  return (
    <div>
      {" "}
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
}
