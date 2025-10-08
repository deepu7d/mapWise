import Maptiler from "@/components/Maptiler";
import React from "react";

export default function Map() {
  return (
    <div className="h-dvh w-full max-w-5xl border-2 border-gray-300 rounded-lg overflow-hidden m-auto">
      {/* <Map
              destination={{
                name: sessionData.destinationName,
                position: sessionData.destinationPosition,
              }}
              currentUser={sessionData.userId}
            /> */}
      <Maptiler />
    </div>
  );
}
