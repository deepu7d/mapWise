import { useEffect, useState } from "react";
import { ShapeSource, LineLayer } from "@maplibre/maplibre-react-native";
import { Position, User } from "@repo/types";
import { useAppDispatch, addDistance, addDuration } from "@repo/store";

// User colors for different routes
const usersColor = [
  { hex: "#E6194B" }, // Red
  { hex: "#3CB44B" }, // Green
  { hex: "#FFE119" }, // Yellow
  { hex: "#4363D8" }, // Blue
  { hex: "#F58231" }, // Orange
  { hex: "#911EB4" }, // Purple
  { hex: "#46F0F0" }, // Cyan
  { hex: "#F032E6" }, // Magenta
];

// Define the prop types
type RoutingProps = {
  user: User;
  index: number;
  isRoutingFinished: (finished: boolean) => void;
};

// Define the route stats type
type RouteStats = {
  distance: number;
  duration: number;
};

/**
 * Calculates the Haversine distance between two points on Earth.
 * @param coord1 - First coordinate as [latitude, longitude]
 * @param coord2 - Second coordinate as [longitude, latitude]
 * @returns Distance in meters
 */
const haversineDistance = (coord1: Position, coord2: number[]) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371e3; // Earth's radius in metres

  const lat1 = coord1[0];
  const lon1 = coord1[1];
  const lat2 = coord2[1]; // coord2 is [lon, lat]
  const lon2 = coord2[0];

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in metres
};

/**
 * A component to render a single user's route polyline on the map.
 * It fetches the full route, then dynamically "shrinks" it from the start
 * based on the user's current position.
 */
export default function RoutingPolyline({
  user,
  index,
  isRoutingFinished,
}: RoutingProps) {
  const dispatch = useAppDispatch();
  const [fullPath, setFullPath] = useState<Position[]>([]);
  const [visiblePath, setVisiblePath] = useState<Position[]>([]);
  const [initialRouteStats, setInitialRouteStats] = useState<RouteStats | null>(
    null
  );

  const userColor = usersColor[index % usersColor.length].hex;

  // Effect to fetch and set the initial full route
  useEffect(() => {
    const fetchRoute = () => {
      const data = user.routeData;
      console.log("User routeData:", user.id, data);
      if (data && data.routes && data.routes.length > 0) {
        const routeData = data.routes[0];
        const coordinates = routeData.geometry.coordinates.map(
          (coord: [number, number]) => [coord[0], coord[1]] as [number, number]
        );
        setFullPath(coordinates);
        setVisiblePath(coordinates); // Initially, visible path is the full path

        const stats = {
          distance: routeData.distance,
          duration: routeData.duration,
        };
        setInitialRouteStats(stats);

        // Dispatch initial total distance and duration
        dispatch(addDistance({ id: user.id, distance: stats.distance }));
        dispatch(addDuration({ id: user.id, duration: stats.duration }));
      }
    };
    fetchRoute();
    isRoutingFinished(true);
  }, [user.routeData, user.id, dispatch]); // Depend on routeData

  // Effect to update the visible path based on user's current position
  useEffect(() => {
    // Wait until we have the full path and stats
    if (fullPath.length === 0 || !initialRouteStats) return;

    // --- Find the point on the path closest to the user's current location ---
    let closestPointIndex = 0;
    let minDistance = Infinity;

    fullPath.forEach((point, index) => {
      // user.position is [lat, lon], point is [lon, lat]
      const distance = haversineDistance(user.position, point);
      if (distance < minDistance) {
        minDistance = distance;
        closestPointIndex = index;
      }
    });

    // --- Create the new "shrunken" path by slicing the original path ---
    // Ensure the user's current location is prepended to the remaining path
    // to draw a line *from* their location *to* the rest of the path.
    // Note: user.position is [lat, lon], GeoJSON needs [lon, lat]
    const userPosGeoJSON: Position = [user.position[1], user.position[0]];
    const remainingPath = [
      userPosGeoJSON,
      ...fullPath.slice(closestPointIndex),
    ];

    setVisiblePath(remainingPath);

    // --- Recalculate remaining distance and duration ---
    let newRemainingDistance = 0;
    if (remainingPath.length > 1) {
      for (let i = 0; i < remainingPath.length - 1; i++) {
        // haversineDistance expects (coord1: [lat, lon], coord2: [lon, lat])
        // remainingPath points are all [lon, lat]
        const coord1: Position = [remainingPath[i][1], remainingPath[i][0]]; // Convert to [lat, lon]
        const coord2 = remainingPath[i + 1]; // Already [lon, lat]
        newRemainingDistance += haversineDistance(coord1, coord2);
      }
    }

    let newRemainingDuration = 0;
    if (initialRouteStats.distance > 0) {
      // Calculate average speed from the *initial* full route
      const averageSpeed =
        initialRouteStats.distance / initialRouteStats.duration; // m/s
      // Avoid division by zero if speed is somehow 0
      newRemainingDuration =
        averageSpeed > 0 ? newRemainingDistance / averageSpeed : 0;
    }

    // --- Dispatch the updated (remaining) values to Redux ---
    dispatch(addDistance({ id: user.id, distance: newRemainingDistance }));
    dispatch(addDuration({ id: user.id, duration: newRemainingDuration }));
  }, [user.position, fullPath, initialRouteStats, dispatch, user.id]); // Re-run when user moves

  // Create the GeoJSON data for the source
  const routeGeoJson: GeoJSON.Feature<GeoJSON.LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: visiblePath, // Use the dynamically updated path
    },
  };

  // Don't render if there's no path data
  if (visiblePath.length < 2) {
    console.log("No visible path for user:", user.id, visiblePath.length);
    return null;
  }

  console.log(
    "Rendering polyline for user:",
    user.id,
    "with",
    visiblePath.length,
    "points"
  );

  // Render the MapLibre components for React Native
  return (
    <ShapeSource id={user.id} shape={routeGeoJson}>
      <LineLayer
        id={`${user.id}-line`} // Layer ID
        style={{
          lineColor: userColor,
          lineWidth: 4,
          lineOpacity: 0.8,
          lineJoin: "round",
          lineCap: "round",
        }}
      />
    </ShapeSource>
  );
}
