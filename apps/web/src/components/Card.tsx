"use client";
import { User } from "@/types";
import React, { useMemo } from "react";

type userCard = {
  user: User;
  isCurrent: boolean;
};
const colorPalette = [
  "bg-sky-200",
  "bg-green-200",
  "bg-amber-200",
  "bg-rose-200",
  "bg-indigo-200",
  "bg-teal-200",
  "bg-pink-200",
];
const Card = ({ user, isCurrent }: userCard) => {
  const randomColor = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * colorPalette.length);
    return colorPalette[randomIndex];
  }, []);

  return (
    <li
      className={`${
        isCurrent ? "font-bold shadow-sm shadow-slate-400 " : ""
      } ${randomColor} w-fit px-3 py-1 rounded-2xl text-slate-800 my-1`}
    >
      {isCurrent ? "You" : user.name}
    </li>
  );
};

export default Card;
