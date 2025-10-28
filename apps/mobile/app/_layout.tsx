import "./global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      initialRouteName="(playground)"
      screenOptions={{
        headerStyle: { backgroundColor: "#bfdbfe" },
        headerTintColor: "black",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="(playground)"
        options={{
          title: "Playground",
        }}
      />
    </Stack>
  );
}
