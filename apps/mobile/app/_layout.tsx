import "./global.css";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import icons
import { useEffect, useState } from "react";
import { sessionData } from "@repo/types";
import { getData } from "@/lib/utils";
import * as Clipboard from "expo-clipboard";

export default function RootLayout() {
  const [sessionData, setSessionData] = useState<sessionData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSessionData = async () => {
      const data = await getData("sessionData");
      setSessionData(data);
    };
    fetchSessionData();
  }, []);

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Success", message);
    }
  };

  const handleShare = async () => {
    if (!sessionData) return;

    try {
      await Clipboard.setStringAsync(sessionData.roomId);
      showToast("Room ID copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      showToast("Failed to copy Room ID");
    }
  };

  const handleExit = async () => {
    Alert.alert("Exit", "Are you sure you want to leave?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Exit",
        onPress: async () => {
          try {
            // Clear session data
            // await storeData("sessionData", null as any);
            // Navigate to home screen and reset navigation stack
            router.navigate("/");
          } catch (error) {
            console.error("Failed to exit:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(playground)"
          options={{
            // 1. Set the title to "MapWise"
            title: "MapWise",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerBackVisible: false,
            statusBarStyle: "dark", // This makes icons black/dark gray

            // 2. Add the custom buttons on the right
            headerRight: () => (
              <View style={{ flexDirection: "row", gap: 15, marginRight: 10 }}>
                {/* Blue Share Button */}
                <TouchableOpacity
                  onPress={handleShare}
                  style={{
                    backgroundColor: "#007AFF", // Blue color from image
                    padding: 8,
                    borderRadius: 10,
                  }}
                >
                  <Ionicons
                    name="share-social" // Share icon
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>

                {/* Red Exit Button */}
                <TouchableOpacity
                  onPress={handleExit}
                  style={{
                    backgroundColor: "#FF3B30", // Red color from image
                    padding: 8,
                    borderRadius: 10,
                  }}
                >
                  <Ionicons
                    name="exit-outline" // Exit icon
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
