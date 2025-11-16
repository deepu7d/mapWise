import { View, Text, TextInput, Button, Alert } from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import * as Location from "expo-location";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 character long" })
    .optional(),
  roomId: z.string().min(10, { message: "Enter valid room ID" }).optional(),
});

type formSchemaType = z.infer<typeof formSchema>;

export default function JoinForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });
  const handleFormSubmit = async (data: formSchemaType) => {
    try {
      // 1. Ask for Foreground permissions
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need foreground location permission to proceed.",
        );
        return;
      }

      // 2. Ask for Background permissions
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need background location permission for this feature to work.",
        );
        return;
      }

      // 3. If both are granted, navigate to the playground
      console.log("Permissions granted. Navigating to playground...");
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = initialLocation.coords;
      console.log(`Initial location: ${latitude}, ${longitude}`);
      router.push("/(playground)"); // Or your navigation method
    } catch (err) {
      console.error("Error requesting permissions:", err);
      Alert.alert("Error", "An error occurred while requesting permissions.");
    }
  };
  return (
    <View className="gap-8 bg-white px-10 py-8 shadow-md shadow-slate-400">
      <Text className="self-center text-3xl font-bold">Join Room</Text>
      <View className="flex gap-1">
        <Text className="font-medium text-gray-600">Your Name</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="First name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              className="rounded-xl border border-gray-300 px-3 py-3 text-base text-gray-800 focus:border-blue-400 "
            />
          )}
          name="name"
        />
        {errors.name && <Text className="text-red-500">This is required.</Text>}
      </View>
      <View className="flex gap-1">
        <Text className="font-medium text-gray-600 ">Room ID</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Enter Room ID"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              className="rounded-xl border border-gray-300 px-3 py-3 text-base text-gray-800 focus:border-blue-400 "
            />
          )}
          name="roomId"
        />
        {errors.roomId && (
          <Text className="text-red-500">This is required.</Text>
        )}
      </View>

      <Button title="Submit" onPress={handleSubmit(handleFormSubmit)} />
    </View>
  );
}
