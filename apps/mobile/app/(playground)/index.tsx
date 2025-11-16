import RoutingPolyline from "@/components/map/LibreRouting";
import { getData } from "@/lib/utils";
import {
  Callout,
  Camera,
  MapView,
  MarkerView,
  PointAnnotation,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { useSocketContext } from "@repo/hooks";
import {
  updateUserPosition,
  useAppDispatch,
  useAppSelector,
} from "@repo/store";
import { Position, sessionData } from "@repo/types";
import { Fragment, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import * as Location from "expo-location";
export default function Map() {
  const [sessionData, setSessionData] = useState<sessionData | null>(null);
  const { socket } = useSocketContext();
  const currentPositionRef = useRef<Position | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchSessionData = async () => {
      const data = await getData("sessionData");
      setSessionData(data);
    };
    fetchSessionData();
  }, []);

  useEffect(() => {
    if (!socket || !sessionData) return;
    let locationSubscription: Location.LocationSubscription | null = null;

    // 1. Function to start watching location
    const startWatching = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Foreground location permission denied");
          // You should probably show an alert to the user here
          return;
        }

        console.log("Starting location watcher...");
        locationSubscription = await Location.watchPositionAsync(
          {
            // High accuracy and frequency
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000, // Get an update every 1 second
            distanceInterval: 1, // Get an update every 1 meter
          },
          (location) => {
            // This callback fires with every new location update
            // We update the ref so the setInterval can read it
            currentPositionRef.current = [
              location.coords.latitude,
              location.coords.longitude,
            ];
            dispatch(
              updateUserPosition({
                id: sessionData.userId,
                position: [location.coords.latitude, location.coords.longitude],
              }),
            );
          },
        );
      } catch (err) {
        console.error("Error starting location watcher:", err);
      }
    };

    // 2. Start the watcher
    startWatching();

    // 3. Start your socket emitter interval
    console.log("Starting socket emitter interval...");
    const intervalId = setInterval(() => {
      if (currentPositionRef.current) {
        socket.emit("update-location", {
          userId: sessionData.userId,
          position: currentPositionRef.current,
        });
      }
    }, 3000); // Your 3-second interval

    // 4. Cleanup function
    // This runs when the component unmounts
    return () => {
      console.log("Cleaning up watcher and interval...");
      // Stop the location watcher
      if (locationSubscription) {
        locationSubscription.remove();
      }
      // Stop the interval
      clearInterval(intervalId);
    };
  }, [socket, sessionData]);

  const [routingFinished, setRoutingFinished] = useState(false);
  const users = useAppSelector((state) => state.users);
  const isRoutingFinished = (finished: boolean) => {
    setRoutingFinished(finished);
  };
  if (users.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl">No users in the session.</Text>
      </View>
    );
  }
  if (!sessionData) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl">Loading session data...</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 items-center justify-center">
      <Text className={`${routingFinished ? "hidden" : "block"} text-2xl`}>
        Loading Routes...
      </Text>
      <View className={`${routingFinished ? "h-full" : "h-0"} w-full`}>
        <MapView
          style={{ flex: 1 }}
          mapStyle={"https://tiles.openfreemap.org/styles/positron"}
          compassEnabled={true}
        >
          <Camera
            defaultSettings={{
              centerCoordinate: [
                sessionData.destinationPosition[1],
                sessionData.destinationPosition[0],
              ],
              zoomLevel: 15,
            }}
          />
          {/* <MarkerView coordinate={AMBALA_COORDS}>
        <View className="w-5 h-5 bg-blue-500 border rounded-xl border-red-950" />
      </MarkerView> */}
          {/* <UserLocation visible={true} showsUserHeadingIndicator={true} /> */}
          {users.map((user, index) => (
            <Fragment key={user.id}>
              <PointAnnotation
                id={user.id}
                coordinate={[user.position[1], user.position[0]]}
              >
                <Callout title={user.name} />
              </PointAnnotation>
              <RoutingPolyline
                user={user}
                index={index}
                isRoutingFinished={isRoutingFinished}
              />
            </Fragment>
          ))}
        </MapView>
      </View>
    </View>
  );
}
