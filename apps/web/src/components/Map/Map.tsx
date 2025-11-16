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
import { Destination, Position, sessionData, User } from "@repo/types";
import LibreRouting from "./Routing";
import { Fragment, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useMapSession, useSocketContext } from "@repo/hooks";
import toast from "react-hot-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { MemoizedUserMarker } from "./user-markers";
import { MemoizedUserAvatarBar } from "./user-avatar";
import DestinationMarker from "./destination-marker";

type FriendsMapProps = {
  sessionData: sessionData;
};

export default function MapLibre({ sessionData }: FriendsMapProps) {
  useGeolocation(sessionData?.userId);

  const users = useAppSelector((state) => state.users);
  const mapRef = useRef<MapRef>(null);
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
    <div className="relative h-full w-full">
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
            <MemoizedUserMarker
              key={user.id}
              user={user}
              colorHex={colorHex}
              index={index}
            />
          );
        })}
        <DestinationMarker
          destinationPosition={sessionData.destinationPosition}
        />

        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />
      </Map>
      <MemoizedUserAvatarBar
        users={users}
        onUserClick={(user) => flyToUser(user)}
      />
    </div>
  );
}

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
