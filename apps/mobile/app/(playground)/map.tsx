import {
  Callout,
  Camera,
  MapView,
  MarkerView,
  PointAnnotation,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { useEffect } from "react";
import { PermissionsAndroid, Platform, View } from "react-native";
const AMBALA_COORDS = [76.78, 30.38]; // [longitude, latitude]
const NEARBY_COORDS = [76.8, 30.4];
export default function Map() {
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestLocationPermission();
  }, []);

  return (
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
      <Camera centerCoordinate={AMBALA_COORDS} zoomLevel={15} />
      {/* <MarkerView coordinate={AMBALA_COORDS}>
        <View className="w-5 h-5 bg-blue-500 border rounded-xl border-red-950" />
      </MarkerView> */}
      <UserLocation visible={true} showsUserHeadingIndicator={true} />
      <PointAnnotation
        id="ambala-city" // A unique ID is required
        coordinate={AMBALA_COORDS}
      >
        <Callout title="This is Ambala City!" />
      </PointAnnotation>

      {/* An annotation with a title that appears on tap */}
      <PointAnnotation
        id="nearby-place"
        coordinate={NEARBY_COORDS}
        title="A Nearby Place" // This is optional
      >
        {/* The Callout component creates the info window that pops up */}
        <Callout title="This is a callout!" />
      </PointAnnotation>
    </MapView>
  );
}
