import { View, Text, TextInput, Button } from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";

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
  const handleFormSubmit = (data: formSchemaType) => {
    router.navigate("/(playground)");
  };
  return (
    <View className="bg-white px-10 py-8 gap-8 shadow-md shadow-slate-400">
      <Text className="text-3xl font-bold self-center">Join Room</Text>
      <View className="flex gap-1">
        <Text className="text-gray-600 font-medium">Your Name</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="First name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              className="border border-gray-300 rounded-xl px-3 py-3 text-base text-gray-800 focus:border-blue-400 "
            />
          )}
          name="name"
        />
        {errors.name && <Text className="text-red-500">This is required.</Text>}
      </View>
      <View className="flex gap-1">
        <Text className="text-gray-600 font-medium ">Room ID</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Enter Room ID"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              className="border border-gray-300 rounded-xl px-3 py-3 text-base text-gray-800 focus:border-blue-400 "
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
