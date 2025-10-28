"use client";
import { Layer, Source } from "@vis.gl/react-maplibre";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@repo/store";
import { Position, User } from "@repo/types";
import { addDistance, addDuration } from "@repo/store";
import { usersColor } from "@/helper/constant";

type RoutingProps = {
  user: User;
  destination: Position;
  index: number;
};
type RouteStats = {
  distance: number;
  duration: number;
};

// const lineLayerStyle = {
//   id: "my-polyline-layer",
//   type: "line",
//   source: "my-polyline-source", // Must match the source's id
//   layout: {
//     "line-join": "round",
//     "line-cap": "round",
//   },
//   paint: {
//     "line-color": "#007cbf", // A nice blue color
//     "line-width": 4,
//     "line-opacity": 0.8,
//   },
// } as const;

export default function LibreRouting({
  user,
  destination,
  index,
}: RoutingProps) {
  const start = user.position;
  const end = destination;
  const dispatch = useAppDispatch();
  const [fullPath, setFullPath] = useState([]);
  const [visiblePath, setVisiblePath] = useState([]);
  const [initialRouteStats, setInitialRouteStats] = useState<RouteStats | null>(
    null
  );

  const userColor = usersColor[index % usersColor.length].hex;

  const lineLayerStyle = {
    id: user.id,
    type: "line",
    source: user.id, // Use the unique source ID
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": userColor, // Use the dynamic color
      "line-width": 4,
      "line-opacity": 0.8,
    },
  } as const;

  useEffect(() => {
    const fetchRoute = () => {
      console.log("calling OSRM warning......");
      const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.routes && data.routes.length > 0) {
            const routeData = data.routes[0];
            const coordinates = routeData.geometry.coordinates.map(
              (coord: [number, number]) =>
                [coord[0], coord[1]] as [number, number]
            );
            setFullPath(coordinates);
            setVisiblePath(coordinates);
            setInitialRouteStats({
              distance: routeData.distance,
              duration: routeData.duration,
            });
            dispatch(
              addDistance({ id: user.id, distance: routeData.distance })
            );
            dispatch(
              addDuration({ id: user.id, duration: routeData.duration })
            );
          }
        })
        .catch((err) => console.error("Error fetching route:", err));
    };
    fetchRoute();
  }, []);

  useEffect(() => {
    // Wait until we have the full path from the API
    if (fullPath.length === 0 || !initialRouteStats) return;

    // --- Find the point on the path closest to the user's current location ---
    let closestPointIndex = 0;
    let minDistance = Infinity;

    fullPath.forEach((point, index) => {
      const distance = haversineDistance(user.position, point);
      if (distance < minDistance) {
        minDistance = distance;
        closestPointIndex = index;
      }
    });

    // --- Create the new "shrunken" path by slicing the original path ---
    const remainingPath = fullPath.slice(closestPointIndex);
    setVisiblePath(remainingPath);

    // --- Recalculate remaining distance and duration ---
    let newRemainingDistance = 0;
    if (remainingPath.length > 1) {
      for (let i = 0; i < remainingPath.length - 1; i++) {
        // Here we calculate distance between two points on the path, both are [lon, lat]
        newRemainingDistance += haversineDistance(
          [remainingPath[i][1], remainingPath[i][0]], // Convert to [lat, lon] for our function
          remainingPath[i + 1]
        );
      }
    }

    let newRemainingDuration = 0;
    if (initialRouteStats.distance > 0) {
      const averageSpeed =
        initialRouteStats.distance / initialRouteStats.duration; // m/s
      newRemainingDuration = newRemainingDistance / averageSpeed;
    }

    // --- Dispatch the updated values to Redux ---
    dispatch(addDistance({ id: user.id, distance: newRemainingDistance }));
    dispatch(addDuration({ id: user.id, duration: newRemainingDuration }));
  }, [user.position, fullPath]);

  // === CHANGE #3: CREATE THE GEOJSON DATA FOR THE SOURCE ===
  const routeGeoJson: GeoJSON.Feature<GeoJSON.LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: visiblePath,
    },
  };

  return (
    <Source id={user.id} type="geojson" data={routeGeoJson}>
      <Layer {...lineLayerStyle} />
    </Source>
  );
}

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
