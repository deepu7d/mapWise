import { View, Text, TextInput, Button, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sessionData } from "@repo/types";
import { handleCreateRoomForm } from "@repo/hooks";
import { storeData } from "@/lib/utils";
import { router } from "expo-router";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 character long" }),
  destination: z.object({
    name: z.string(),
    position: z.array(z.number()).length(2),
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateRoom() {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const destinationQuery = watch("destination.name");

  useEffect(() => {
    if (!destinationQuery) {
      setSearchResults([]);
      return;
    }
  }, [destinationQuery]);

  useEffect(() => {
    if (!destinationQuery) return;
    if (destinationQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinationQuery)}`,
          {
            headers: {
              "User-Agent": "MapWise/1.0",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [destinationQuery]);

  const handleDestinationSelect = (result: any) => {
    setValue("destination.name", result.display_name);
    setValue("destination.position", [
      parseFloat(result.lat),
      parseFloat(result.lon),
    ]);
    setSearchResults([]);
  };

  const onSubmit = async (data: FormData) => {
    console.log("Submitting data:", data);
    setIsLoading(true);
    try {
      const response = await handleCreateRoomForm({
        name: data.name,
        destination: data.destination,
        userPosition: [52.520007, 13.404954],
        apiUrl: "https://bfxz3hqs-8000.inc1.devtunnels.ms",
      });
      if (response && response.data) {
        const sessionData: sessionData = response.data;
        console.log("Session Data:", sessionData);
        await storeData("sessionData", sessionData);
        router.replace("/(playground)");
      } else {
        console.error("Failed to get a valid response from the server.");
      }
    } catch (error) {
      console.log("Error creating room");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View className="bg-white px-10 py-8 gap-8 shadow-md shadow-slate-400">
      <Text className="text-3xl font-bold self-center">Create Room</Text>
      <View className="flex gap-1">
        <Text className="text-gray-600 font-medium">Your Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="First name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className="border border-gray-300 rounded-xl px-3 py-3 text-base text-gray-800 focus:border-blue-400 "
            />
          )}
        />
        {errors.name && (
          <Text className="text-red-500">{errors.name.message}</Text>
        )}
      </View>
      <View className="flex gap-1">
        <Text className="text-gray-600 font-medium ">Destination</Text>

        <Controller
          control={control}
          name="destination.name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Enter Desination"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className="border border-gray-300 rounded-xl px-3 py-3 text-base text-gray-800 focus:border-blue-400 "
            />
          )}
        />
        {searchResults.length > 0 && (
          <ScrollView className="absolute top-20 bg-white z-10 max-h-40 border border-gray-300 rounded-md">
            {searchResults.map((result) => (
              <Text
                key={result.place_id}
                className="px-3 py-2 border-b border-gray-200"
                onPress={() => handleDestinationSelect(result)}
              >
                {result.display_name}
              </Text>
            ))}
          </ScrollView>
        )}
        {errors.destination?.name && (
          <Text className="text-red-500">
            {errors.destination.name.message}
          </Text>
        )}
      </View>

      <Button
        title="Submit"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      />
    </View>
  );
}
