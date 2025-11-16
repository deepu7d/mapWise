"use client";

import React from "react";
import StatsCards from "./stats-cards";

type UserCardsProps = {
  currentSocketId: string | null;
};

export default function StatsContainer({ currentSocketId }: UserCardsProps) {
  return (
    <div className="no-select no-highlight h-full w-full max-w-5xl overflow-x-auto rounded-lg px-4">
      <StatsCards currentSocketId={currentSocketId} />
    </div>
  );
}
