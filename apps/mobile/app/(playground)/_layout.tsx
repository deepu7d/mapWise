import React from "react";
import { Tabs } from "expo-router";
export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="map"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#bfdbfe",
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarLabel: "Chat",
          tabBarBadge: 3,
        }}
      />
    </Tabs>
  );
}
