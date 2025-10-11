import * as React from "react";
import {
  Map,
  FullscreenControl,
  Marker,
  NavigationControl,
  ScaleControl,
  Source,
  Layer,
  GeolocateControl,
} from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useAppSelector } from "@/redux/hooks";
import { usersColor } from "@/helper/constant";
import { Destination } from "@repo/types";
import LibreRouting from "./LibreRouting";

type FriendsMapProps = { destination: Destination; currentUser: string };

export default function MapLibre({
  destination,
  currentUser,
}: FriendsMapProps) {
  const users = useAppSelector((state) => state.users);
  return (
    <Map
      initialViewState={{
        latitude: destination.position[0],
        longitude: destination.position[1],
        zoom: 15,
      }}
      mapStyle="https://tiles.openfreemap.org/styles/positron"
    >
      {users.map((user, index) => {
        const colorHex = usersColor[index % usersColor.length].hex;
        return (
          <React.Fragment key={user.id}>
            <Marker
              latitude={user.position[0]}
              longitude={user.position[1]}
              anchor="bottom"
            >
              <UserIcon color={colorHex} />
            </Marker>
            <LibreRouting
              user={user}
              destination={destination.position}
              index={index}
              key={index}
            />
          </React.Fragment>
        );
      })}
      <Marker
        latitude={destination.position[0]}
        longitude={destination.position[1]}
        anchor="bottom"
      >
        <svg
          height="24"
          viewBox="0 0 24 24"
          style={{ cursor: "pointer", fill: "#d00", stroke: "none" }}
        >
          <path d="M12 0C7.58 0 4 3.58 4 8c0 5.5 8 13 8 13s8-7.5 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
        </svg>
      </Marker>

      <FullscreenControl />
      <NavigationControl />
      <GeolocateControl />
      <ScaleControl />
    </Map>
  );
}

const UserIcon = ({ color = "#d00" }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    style={{ cursor: "pointer", stroke: "none" }}
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5-2.5z" />
  </svg>
);
