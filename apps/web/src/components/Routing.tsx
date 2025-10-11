// "use client";

// import { useEffect, useState } from "react";
// import { Polyline, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { latLng, LatLngExpression } from "leaflet";
// import { useAppDispatch } from "@/redux/hooks";
// import { Position, User } from "@repo/types";
// import {
//   addColor,
//   addDistance,
//   addDuration,
// } from "@/redux/features/users/usersSlice";
// import { usersColor } from "@/helper/constant";

// type RoutingProps = {
//   user: User;
//   destination: Position;
//   index: number;
// };
// type RouteStats = {
//   distance: number;
//   duration: number;
// };

// const Routing = ({ user, destination, index }: RoutingProps) => {
//   const start = user.position;
//   const end = destination;
//   const dispatch = useAppDispatch();
//   const map = useMap();
//   const [fullPath, setFullPath] = useState<LatLngExpression[]>([]);
//   const [visiblePath, setVisiblePath] = useState<LatLngExpression[]>([]);
//   const [initialRouteStats, setInitialRouteStats] = useState<RouteStats | null>(
//     null
//   );

//   useEffect(() => {
//     const fetchRoute = () => {
//       console.log("calling OSRM warning......");
//       const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
//       fetch(url)
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.routes && data.routes.length > 0) {
//             const routeData = data.routes[0];
//             const coordinates = routeData.geometry.coordinates.map(
//               (coord: [number, number]) =>
//                 [coord[1], coord[0]] as [number, number]
//             );
//             setFullPath(coordinates);
//             setVisiblePath(coordinates);
//             setInitialRouteStats({
//               distance: routeData.distance,
//               duration: routeData.duration,
//             });
//             dispatch(
//               addDistance({ id: user.id, distance: routeData.distance })
//             );
//             dispatch(
//               addDuration({ id: user.id, duration: routeData.duration })
//             );
//             map.fitBounds(coordinates, { padding: [50, 50] });
//           }
//         })
//         .catch((err) => console.error("Error fetching route:", err));
//     };
//     fetchRoute();
//   }, []);

//   useEffect(() => {
//     if (fullPath.length === 0 || !initialRouteStats) return; //todo
//     let closestPointIndex = 0;
//     let minDistance = Infinity;
//     fullPath.forEach((point, index) => {
//       const distance = latLng(start as [number, number]).distanceTo(
//         point as [number, number]
//       );
//       if (distance < minDistance) {
//         minDistance = distance;
//         closestPointIndex = index;
//       }
//     });

//     const remainingPath = fullPath.slice(closestPointIndex);
//     setVisiblePath(remainingPath);
//     let newRemainingDistance = 0;
//     if (remainingPath.length > 1) {
//       for (let i = 0; i < remainingPath.length - 1; i++) {
//         const point1 = latLng(remainingPath[i] as [number, number]);
//         const point2 = latLng(remainingPath[i + 1] as [number, number]);
//         newRemainingDistance += point1.distanceTo(point2);
//       }
//     }

//     // 2. Estimate remaining duration based on average speed
//     let newRemainingDuration = 0;
//     // Avoid division by zero if route is extremely short
//     if (initialRouteStats.distance > 0) {
//       const averageSpeed =
//         initialRouteStats.distance / initialRouteStats.duration; // m/s
//       newRemainingDuration = newRemainingDistance / averageSpeed;
//     }

//     // 3. Dispatch the new values to your Redux store
//     dispatch(addDistance({ id: user.id, distance: newRemainingDistance }));
//     dispatch(addDuration({ id: user.id, duration: newRemainingDuration }));
//   }, [JSON.stringify(start), fullPath]);

//   const userColor = usersColor[index % usersColor.length];
//   // console.log(visiblePath);
//   if (!user.online) return;
//   return <Polyline positions={visiblePath} color={userColor.hex} weight={5} />;
// };

// export default Routing;
