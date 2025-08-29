"use client";

import { useEffect, useState } from "react";
// ***** FIX 1: Re-import and use the useMap hook *****
import { Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import { LatLngExpression } from "leaflet";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";

type RoutingProps = {
  start: [number, number];
  end: [number, number];
  color: string;
  // ***** FIX 2: Revert the prop name to match the parent component *****
  onRouteFound: (duration: number, distance: number) => void;
};

const DEBOUNCE_DELAY_MS = 500;

const Routing = ({ start, end, color, onRouteFound }: RoutingProps) => {
  // ***** FIX 1 (continued): Call the useMap hook *****
  const map = useMap();
  const [visiblePath, setVisiblePath] = useState<LatLngExpression[]>([]);
  const [initialRoute, setInitialRoute] = useState<any>(null);

  useDebouncedEffect(
    () => {
      if (!start || !end) return;

      const fetchNewRoute = () => {
        console.log("calling OSRM warning......");
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            if (data.routes && data.routes.length > 0) {
              const routeData = data.routes[0];
              const coordinates = routeData.geometry.coordinates.map(
                (coord: [number, number]) =>
                  [coord[1], coord[0]] as [number, number]
              );
              setInitialRoute(routeData);
              setVisiblePath(coordinates);
              // Call the callback with the correct arguments
              onRouteFound(routeData.duration, routeData.distance);

              // Now you can safely use the map instance again
              map.fitBounds(coordinates);
            }
          })
          .catch((err) => console.error("Error fetching route:", err));
      };

      if (initialRoute) {
        const userPoint = turf.point([start[1], start[0]]);
        const routeLine = turf.lineString(initialRoute.geometry.coordinates);
        const snapped = turf.nearestPointOnLine(routeLine, userPoint, {
          units: "meters",
        });
        const remainingRoute = turf.lineSlice(
          snapped,
          turf.point(
            routeLine.geometry.coordinates[
              routeLine.geometry.coordinates.length - 1
            ]
          ),
          routeLine
        );
        const connectorLine = turf.lineString([
          userPoint.geometry.coordinates,
          snapped.geometry.coordinates,
        ]);
        const remainingDistanceOnRoute = turf.length(remainingRoute, {
          units: "meters",
        });
        const connectorDistance = turf.length(connectorLine, {
          units: "meters",
        });
        const totalRemainingDistance =
          remainingDistanceOnRoute + connectorDistance;
        const avgSpeed = initialRoute.distance / initialRoute.duration;
        const totalRemainingDuration = totalRemainingDistance / avgSpeed;
        const newVisiblePathCoords = [
          ...connectorLine.geometry.coordinates,
          ...remainingRoute.geometry.coordinates,
        ];
        setVisiblePath(
          newVisiblePathCoords.map(
            (coord: any) => [coord[1], coord[0]] as LatLngExpression
          )
        );

        // ***** FIX 2 (continued): Call the callback with the correct arguments *****
        onRouteFound(totalRemainingDuration, totalRemainingDistance);
      } else {
        fetchNewRoute();
      }
    },
    [start, end, initialRoute, onRouteFound, map],
    DEBOUNCE_DELAY_MS
  );

  return visiblePath.length > 0 ? (
    <Polyline positions={visiblePath} color={color} />
  ) : null;
};

export default Routing;
