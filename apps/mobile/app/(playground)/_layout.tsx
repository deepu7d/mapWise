import React from "react";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#bfdbfe",
        },
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          tabBarLabel: "Chat",
          tabBarBadge: 3,
        }}
      />
      <Tabs.Screen name="map" />
    </Tabs>
  );
}
