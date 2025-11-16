import { Position } from "@repo/types";
import { Marker } from "@vis.gl/react-maplibre";
import React from "react";

export default function DestinationMarker({
  destinationPosition,
}: {
  destinationPosition: Position;
}) {
  return (
    <Marker
      latitude={destinationPosition[0]}
      longitude={destinationPosition[1]}
      anchor="bottom"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="red"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-flag-icon lucide-flag"
      >
        <path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" />
      </svg>
    </Marker>
  );
}
