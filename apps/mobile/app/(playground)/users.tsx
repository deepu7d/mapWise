import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useAppSelector } from "@repo/store";

export default function Users() {
  const users = useAppSelector((state) => state.users);
  console.log("Users:", users);
  return (
    <View className="flex-1 bg-white">
      <Text className="text-2xl p-4 font-bold">Users</Text>
      <ScrollView className="bg-neutral-50 border border-neutral-300/50 w-full rounded-t-3xl p-4">
        {users.map((user) => (
          <View
            key={user.id}
            className="bg-neutral-200 px-4 py-2 mb-4 rounded-2xl"
          >
            <Text className="font-bold">{user.name}</Text>
            <Text
              className={`text-${user.online ? "green" : "red"}-400 font-bold`}
            >
              {user.online ? "Online" : "Offline"}
            </Text>
            <Text className="">{user.distance} km</Text>
            <Text>{user.duration} away</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
