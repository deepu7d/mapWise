import React from "react";
import { Tabs } from "expo-router";
import { SocketProvider } from "@repo/hooks";
import { sessionData } from "@repo/types";
import { StoreProvider } from "@repo/store";
export default function TabLayout() {
  const sessionData: sessionData = {
    roomId: "cmht0yeau0000m6rloumdy1iw",
    userId: "cmht0z3ox0004m6rljv6em956",
    username: "mobile",
    destinationPosition: [30.357234, 76.7951835],
    destinationName: "Jandli, Ambala Cantt, Ambala, Haryana, 132004, India",
  };
  return (
    <StoreProvider>
      <SocketProvider
        sessionData={sessionData}
        apiBaseUrl="https://bfxz3hqs-8000.inc1.devtunnels.ms"
      >
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
      </SocketProvider>
    </StoreProvider>
  );
}
