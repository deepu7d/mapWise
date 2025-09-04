"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { getMarkerSVG } from "@/helper/helperFunctions";
import Routing from "./Routing";
import { Destination } from "@repo/types";
import { useAppSelector } from "@/redux/hooks";
import L from "leaflet";
import { usersColor } from "@/helper/constant";

type FriendsMapProps = { destination: Destination; currentUser: string };

const flagIconSVG = `
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
    <path d="M5 14.5C5 14.5 5 12.5 7 12.5C9 12.5 11 14.5 13 14.5C15 14.5 17 12.5 19 12.5C21 12.5 21 14.5 21 14.5V4.5C21 4.5 21 2.5 19 2.5C17 2.5 15 4.5 13 4.5C11 4.5 9 2.5 7 2.5C5 2.5 5 4.5 5 4.5V14.5Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="#4285F4"/>
    <path d="M5 22V14.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

const destinationIcon = new L.DivIcon({
  html: flagIconSVG,
  className: "",
  iconSize: [40, 40],
  iconAnchor: [5, 40],
});

const FriendsMap = ({ destination, currentUser }: FriendsMapProps) => {
  const users = useAppSelector((state) => state.users);

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
        const colorHex = usersColor[index % usersColor.length].hex;
        const iconSvg = getMarkerSVG(colorHex);

        const userIcon = new L.DivIcon({
          html: iconSvg,
          className: "",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        return (
          <React.Fragment key={user.id}>
            {user.online && (
              <Marker position={user.position} icon={userIcon}>
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -40]}
                  className="
       bg-slate-900/80 p-2 rounded-md shadow-lg border border-white/20
    text-white text-center
  "
                >
                  <div>
                    <span className="block font-bold text-sm">
                      {currentUser === user.id ? "You" : user.name}
                    </span>
                  </div>
                </Tooltip>
              </Marker>
            )}
            <Routing
              user={user}
              destination={destination.position}
              index={index}
            />
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
