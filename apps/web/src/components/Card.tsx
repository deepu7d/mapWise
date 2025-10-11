"use client";
import { usersColor } from "@/helper/constant";
import { formatDuration } from "@/helper/helperFunctions";
import { User } from "@repo/types";
import React from "react";

type userCard = {
  index: number;
  user: User;
  isCurrent: boolean;
};

const Card = ({ index, user, isCurrent }: userCard) => {
  const userColor = usersColor[index % usersColor.length];

  return (
    <li
      className={`
        ${isCurrent ? "font-bold border-1 border-slate-300" : ""} 
        ${!user.online ? "bg-gray-300 text-black " : `${userColor.tailwind}`}
        
      relative px-4 py-2 rounded-2xl text-slate-800 my-1 w-full max-w-sm text-md shadow-sm shadow-slate-400 mx-auto`}
    >
      <h1 className="mb-2">{isCurrent ? "You" : user.name}</h1>
      {user.duration && user.distance ? (
        <div className="flex gap-4">
          <span>{formatDuration(user.duration)} away</span>

          <span>{(user.distance / 1000).toFixed(2)} km</span>
        </div>
      ) : (
        "Reached"
      )}
      <span className="absolute top-1 right-4">
        {user.online ? "Online" : "Offline"}
      </span>
    </li>
  );
};

export default Card;
