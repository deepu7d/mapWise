import "./global.css";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack
        initialRouteName="(playground)"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(playground)"
          options={{
            title: "Playground",
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
