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
  const tooltipHtmlContent =
    user.duration && user.distance
      ? `<div class="flex flex-col gap-1 text-left">
         <span>${formatDuration(user.duration)} away</span>
         <span>${(user.distance / 1000).toFixed(2)} km</span>
       </div>`
      : "Reached";
  return (
    <li
      className={`
        ${isCurrent ? "font-bold shadow-sm shadow-slate-400" : ""} 
        ${!user.online ? "bg-gray-500 text-white border-1 border-black" : `${userColor.tailwind}`}
        
       w-fit px-3 py-1 rounded-2xl text-slate-800 my-1 `}
      data-tooltip-id="my-tooltip"
      data-tooltip-html={tooltipHtmlContent}
      data-tooltip-place="bottom"
    >
      {isCurrent ? "You" : user.name}
    </li>
  );
};

export default Card;
