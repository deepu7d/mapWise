// src/components/UserMarker.tsx
import { Fragment, memo } from "react";
import { Marker } from "@vis.gl/react-maplibre";
import { User } from "@repo/types";
import LibreRouting from "./Routing";

type UserMarkerProps = {
  user: User;
  colorHex: string;
  index: number;
};

function UserMarker({ user, colorHex, index }: UserMarkerProps) {
  return (
    <Fragment>
      <Marker
        latitude={user.position[0]}
        longitude={user.position[1]}
        anchor="bottom"
      >
        <UserIcon color={colorHex} />
      </Marker>
      {/* Assuming index was only for color, passing color directly */}
      <LibreRouting user={user} index={index} />
    </Fragment>
  );
}

export const MemoizedUserMarker = memo(UserMarker);

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
