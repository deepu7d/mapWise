import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useAppSelector } from "@repo/store";
import { formatDuration } from "@/lib/utils";

export const usersColor = [
  { tailwind: "bg-cyan-300", hex: "#67e8f9" },
  { tailwind: "bg-rose-300", hex: "#fda4af" },
  { tailwind: "bg-purple-300", hex: "#d8b4fe" },
  { tailwind: "bg-teal-300", hex: "#5eead4" },
  { tailwind: "bg-indigo-300", hex: "#a5b4fc" },
  { tailwind: "bg-amber-300", hex: "#fcd34d" },
  { tailwind: "bg-emerald-300", hex: "#6ee7b7" },
  { tailwind: "bg-orange-300", hex: "#fdba74" },
  { tailwind: "bg-blue-300", hex: "#93c5fd" },
  { tailwind: "bg-fuchsia-300", hex: "#f0abfc" },
];

export default function Users() {
  const users = useAppSelector((state) => state.users);
  console.log("Users:", users);
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="bg-neutral-100 border border-neutral-300/50 w-full p-4">
        {users.map((user, index) => (
          <View
            key={user.id}
            className="px-4 py-2 mb-4 rounded-2xl "
            style={{
              backgroundColor: usersColor[index % usersColor.length].hex,
            }}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-extrabold text-lg">{user.name}</Text>
              <Text
                className={`text-${user.online ? "green" : "red"}-400 font-bold`}
              >
                {user.online ? "Online" : "Offline"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              {user.distance ? (
                <Text className="font-bold">
                  - {(user.distance / 1000).toFixed(2)} km
                </Text>
              ) : (
                <Text className="font-semibold">- 120 km</Text>
              )}
              {user.duration ? (
                <Text className="font-bold">
                  - {formatDuration(user.duration)} away
                </Text>
              ) : (
                <Text className="font-semibold">- 100 hours away</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
