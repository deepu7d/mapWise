import { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useMessageSession, useSocketContext } from "@repo/hooks";
import { getData } from "@/lib/utils";
import { sessionData } from "@repo/types";
import { AntDesign, Ionicons } from "@expo/vector-icons";

export default function Chat() {
  const { socket } = useSocketContext();
  const [sessionData, setSessionData] = useState<sessionData | null>(null);
  useEffect(() => {
    const fetchSessionData = async () => {
      const data = await getData("sessionData");
      setSessionData(data);
    };
    fetchSessionData();
  }, []);

  const messages = useMessageSession(socket);
  const [messageInput, setMessageInput] = useState("");

  if (!sessionData || !socket) {
    console.log("Loading session data...");
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold">Loading...</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    console.log("Submitting message:", messageInput);
    const message = messageInput.trim();
    if (message === "") return;

    socket?.emit("send-message", {
      content: message,
      userId: sessionData.userId,
      username: sessionData.username,
    });
    setMessageInput("");
  };

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={100}
      className="flex-1 bg-neutral-100"
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        className="flex-1 bg-neutral-100 w-full"
        contentContainerClassName="p-4"
        ListEmptyComponent={
          <Text className="text-center text-neutral-500 mt-4">
            No messages yet. Start the conversation!
          </Text>
        }
        renderItem={({ item: msg, index }) => {
          const showUsername =
            msg.userId !== sessionData.userId &&
            (index === 0 || messages[index - 1].userId !== msg.userId);
          return (
            <View
              className={`flex mt-2 ${msg.userId === sessionData.userId ? "items-end" : "items-start"}`}
            >
              {showUsername && (
                <Text className="text-sm mb-1">{msg.username}</Text>
              )}
              <Text
                className={`${
                  msg.userId === sessionData.userId
                    ? "bg-blue-400  rounded-tl-2xl rounded-br-2xl"
                    : "bg-slate-200  rounded-tr-2xl rounded-bl-2xl"
                } text-slate-800 text-lg  w-fit max-w-[70%] px-3 py-1 break-words`}
              >
                {msg.content}
              </Text>
            </View>
          );
        }}
      />
      <View className="flex flex-row p-4 gap-2 bg-transparent">
        <View className="flex-1">
          <TextInput
            onChangeText={setMessageInput}
            onBlur={() => {}}
            value={messageInput}
            placeholder="Type your message"
            placeholderTextColor="gray"
            className="text-neutral-800 px-4 py-3 bg-neutral-200 flex-1 rounded-full"
          />
        </View>
        <Pressable
          onPress={handleSubmit}
          className="p-4 bg-blue-400 rounded-full"
        >
          <AntDesign name="send" size={20} color="white" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
    // </TouchableWithoutFeedback>
  );
}
