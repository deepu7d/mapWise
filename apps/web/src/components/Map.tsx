"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Icon } from "leaflet";
import Routing from "./Routing";
import { formatDuration } from "@/helper/helperFunctions";
import { Destination, User } from "@/types";

// type Destination = { position: [number, number]; name: string };
type FriendsMapProps = { users: User[]; destination: Destination };

const destinationIcon = new Icon({
  iconUrl: "/icons/destination.png",
  iconSize: [20, 40],
  iconAnchor: [20, 40],
});

const FriendsMap = ({ users, destination }: FriendsMapProps) => {
  const [durations, setDurations] = useState<{ [key: string]: number }>({});
  const [distances, setDistances] = useState<{ [key: string]: number }>({});
  const handleDurationAndTime = (
    userId: string,
    duration: number,
    distance: number
  ) => {
    setDurations((prev) => ({ ...prev, [userId]: duration }));
    setDistances((prev) => ({ ...prev, [userId]: distance }));
  };

  const userColors = ["blue", "green", "purple", "orange", "red"];
  const mySocketId = localStorage.getItem("socketId") || "";

  return (
    <MapContainer
      center={destination.position}
      zoom={15}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {users.map((user, index) => {
        // Calculate distance for each user
        const duration = durations[user.id]; // Get the duration from state
        const distance = distances[user.id] / 1000;

        if (!user.position) return <h1>Fetching user position</h1>; // todo

        return (
          <React.Fragment key={user.id}>
            <Marker position={user.position}>
              // In FriendsMap.tsx
              <Tooltip
                permanent
                direction="top"
                offset={[0, -20]}
                className="
       bg-slate-900/80 p-2 rounded-md shadow-lg border border-white/20
    text-white text-center
  "
              >
                <div>
                  <span className="block font-bold text-sm">
                    {user.id == mySocketId ? "You" : user.name}
                  </span>

                  <span className="block text-s text-slate-700 mt-0.5">
                    {duration
                      ? `${formatDuration(duration)} away`
                      : "Calculating..."}
                  </span>
                  <span className="block text-xs text-slate-400 mt-0.5 ">
                    {distance.toFixed(2)} km
                  </span>
                </div>
              </Tooltip>
              {/* <Popup> //todo
                <div className="font-sans">
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p>
                    Distance: <strong>{distance.toFixed(2)} km</strong>
                  </p>
                </div>
              </Popup> */}
            </Marker>
            {/* <Routing
              start={user.position}
              end={destination.position}
              color={userColors[index % userColors.length]}
              onRouteFound={(dis, dur) =>
                handleDurationAndTime(user.id, dis, dur)
              }
            /> */}
          </React.Fragment>
        );
      })}

      <Marker position={destination.position} icon={destinationIcon}>
        <Popup>
          <h3 className="font-bold">{destination.name}</h3>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default FriendsMap;
