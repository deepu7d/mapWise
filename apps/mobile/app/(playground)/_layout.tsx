import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { SocketProvider } from "@repo/hooks";
import { StoreProvider } from "@repo/store";
import { getData } from "@/lib/utils";
import { sessionData } from "@repo/types";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const [sessionData, setSessionData] = useState<sessionData | null>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      const data = await getData("sessionData");
      setSessionData(data);
    };
    fetchSessionData();
  }, []);

  if (!sessionData) {
    console.log("Loading session data...");
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Loading...</Text>
      </View>
    );
  }

  console.log("env:", process.env.EXPO_PUBLIC_API_BASE_URL);

  return (
    <StoreProvider>
      <SocketProvider
        sessionData={sessionData}
        apiBaseUrl={process.env.EXPO_PUBLIC_API_BASE_URL || ""}
      >
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#bfdbfe",
            },
            tabBarInactiveTintColor: "black",
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Map",
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "map" : "map-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="users"
            options={{
              title: "Users",
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "people" : "people-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: "Chat",
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "chatbubbles" : "chatbubbles-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      </SocketProvider>
    </StoreProvider>
  );
}
