import {
  Map,
  FullscreenControl,
  Marker,
  NavigationControl,
  useMap,
  MapRef,
} from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useAppSelector } from "@repo/store";
import { usersColor } from "@/helper/constant";
import { Destination, sessionData, User } from "@repo/types";
import LibreRouting from "./Routing";
import { Fragment, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useMapSession, useSocketContext } from "@repo/hooks";
import toast from "react-hot-toast";

type FriendsMapProps = {
  sessionData: sessionData;
};

export default function MapLibre({ sessionData }: FriendsMapProps) {
  const userOnlineToast = ({ newUser }: { newUser: User }) => {
    toast(
      <span>
        <span className="font-bold">
          {newUser.id == sessionData?.userId ? "You" : newUser.name}
        </span>{" "}
        Joined
      </span>,
      {
        icon: "🧑🏻",
        className: "border border-solid border-black p-4 rounded-md bg-white",
      }
    );
  };

  const userOfflineToast = ({ username }: { username: string }) => {
    toast(
      <span>
        <span className="font-bold">{username}</span> Offline
      </span>,
      {
        icon: "☹️",
        className: "border border-solid border-black p-4 rounded-md bg-white",
      }
    );
  };

  const users = useAppSelector((state) => state.users);
  const mapRef = useRef<MapRef>(null);
  const userContainerRef = useRef<HTMLDivElement>(null);
  const flyToUser = (user: User) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.flyTo({
      center: [user.position[1], user.position[0]],
      zoom: 15,
      duration: 1500,
    });
  };

  return (
    <div className="h-full w-full relative">
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: sessionData.destinationPosition[0],
          longitude: sessionData.destinationPosition[1],
          zoom: 15,
        }}
        mapStyle="https://tiles.openfreemap.org/styles/positron"
        attributionControl={false}
      >
        <MapController
          users={users}
          destination={{
            name: sessionData.destinationName,
            position: sessionData.destinationPosition,
          }}
        />

        {users.map((user, index) => {
          const colorHex = usersColor[index % usersColor.length].hex;
          return (
            <Fragment key={user.id}>
              <Marker
                latitude={user.position[0]}
                longitude={user.position[1]}
                anchor="bottom"
              >
                <UserIcon color={colorHex} />
              </Marker>
              <LibreRouting user={user} index={index} />
            </Fragment>
          );
        })}

        <Marker
          latitude={sessionData.destinationPosition[0]}
          longitude={sessionData.destinationPosition[1]}
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
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />
      </Map>
      <div
        className="flex gap-2 p-2 overflow-y-auto w-full absolute bottom-0 left-0"
        ref={userContainerRef}
      >
        {users.map((user, index) => {
          const colorTailwind = usersColor[index % usersColor.length].tailwind;
          return (
            <button
              key={user.id}
              onClick={() => flyToUser(user)}
              className={`${colorTailwind} w-10 h-10 rounded-full font-semibold text-slate-800 flex-shrink-0 flex items-center justify-center`}
            >
              {user.name[0].toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
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

function MapController({
  users,
  destination,
}: {
  users: User[];
  destination: Destination;
}) {
  const { current: map } = useMap();

  useEffect(() => {
    if (!map) return;

    if (!users || users.length === 0) {
      map.flyTo({
        center: [destination.position[1], destination.position[0]],
        zoom: 14,
        duration: 1500,
      });
      return;
    }

    const bounds = new maplibregl.LngLatBounds();
    users.forEach((user) => {
      bounds.extend([user.position[1], user.position[0]]);
    });
    bounds.extend([destination.position[1], destination.position[0]]);

    map.fitBounds(bounds, {
      padding: 80,
      duration: 2000,
      maxZoom: 15,
    });
  }, []);

  return null;
}
