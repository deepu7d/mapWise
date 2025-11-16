"use client";

import React from "react";
import StatsCards from "./stats-cards";

type UserCardsProps = {
  currentSocketId: string | null;
};

export default function StatsContainer({ currentSocketId }: UserCardsProps) {
  return (
    <div className="w-full rounded-lg max-w-5xl no-select no-highlight overflow-x-auto h-full px-4">
      <StatsCards currentSocketId={currentSocketId} />
    </div>
  );
}
