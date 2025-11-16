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

export default React.memo(function StatsCard({
  index,
  user,
  isCurrent,
}: userCard) {
  const userColor = usersColor[index % usersColor.length];

  return (
    <li
      className={`
        ${!user.online ? "bg-gradient-to-br from-gray-300 to-gray-400 opacity-80" : `${userColor.tailwind}`}
        group relative mx-auto my-2 w-full max-w-sm transform 
        rounded-2xl
        border border-white/20 px-4
        py-2 
        shadow-lg backdrop-blur-sm

      `}
    >
      {/* Header with Name and Online Status */}
      <div className="mb-2 flex items-center justify-between">
        <h1
          className={`text-md font-bold uppercase ${isCurrent ? "text-gray-900" : "text-gray-900"} tracking-wide`}
        >
          {isCurrent ? (
            <span className="flex items-center gap-2">
              <span>You</span>
            </span>
          ) : (
            user.name
          )}
        </h1>
        <span
          className={`
            rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider
            ${
              user.online
                ? "bg-green-500 text-white"
                : "bg-gray-600 text-gray-200"
            }
          `}
        >
          {user.online ? "● Online" : "○ Offline"}
        </span>
      </div>

      {/* Stats Section */}
      {user.duration && user.distance ? (
        <div className="flex flex-wrap justify-between rounded-lg border border-white/30 bg-white/20 p-2 px-4 backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <span className="text-lg">⏱️</span>
            <span>{formatDuration(user.duration)} away</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <span className="text-lg">📍</span>
            <span>{(user.distance / 1000).toFixed(2)} km</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-green-300 bg-green-100 px-4 py-3 font-bold text-green-800">
          <span className="text-2xl">🎯</span>
          <span className="text-lg">Reached!</span>
        </div>
      )}
    </li>
  );
});
