import "./global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#bfdbfe" },
        headerTintColor: "black",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="(playground)"
        options={{
          title: "Playground",
        }}
      />
    </Stack>
  );
}
