import RoutingPolyline from "@/components/map/LibreRouting";
import {
  Callout,
  Camera,
  MapView,
  MarkerView,
  PointAnnotation,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { useAppSelector } from "@repo/store";
import { Fragment, useState } from "react";
import { Text, View } from "react-native";
const AMBALA_COORDS = [76.78, 30.38]; // [longitude, latitude]
export default function Map() {
  const [routingFinished, setRoutingFinished] = useState(false);
  const users = useAppSelector((state) => state.users);
  const isRoutingFinished = (finished: boolean) => {
    setRoutingFinished(finished);
  };
  return (
    <View className="flex-1 justify-center items-center">
      <Text className={`${routingFinished ? "hidden" : "block"} text-2xl`}>
        Loading Routes...
      </Text>
      <View className={`${routingFinished ? "h-full" : "h-0"} w-full`}>
        <MapView
          style={{ flex: 1 }}
          mapStyle={"https://tiles.openfreemap.org/styles/positron"}
          zoomEnabled={true}
          scrollEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
          attributionEnabled={false}
          compassEnabled={true}
        >
          <Camera
            centerCoordinate={[AMBALA_COORDS[0], AMBALA_COORDS[1]]}
            zoomLevel={15}
          />
          {/* <MarkerView coordinate={AMBALA_COORDS}>
        <View className="w-5 h-5 bg-blue-500 border rounded-xl border-red-950" />
      </MarkerView> */}
          <UserLocation visible={true} showsUserHeadingIndicator={true} />
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
