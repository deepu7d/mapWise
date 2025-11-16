import { useEffect, useState, useCallback } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { useMessageSession, useSocketContext } from "@repo/hooks";
import { getData } from "@/lib/utils";
import { Message, sessionData } from "@repo/types";
import { AntDesign } from "@expo/vector-icons";

export default function Chat() {
  console.log("Chat component rendered");
  const { socket } = useSocketContext();
  const [sessionData, setSessionData] = useState<sessionData | null>(null);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const fetchSessionData = async () => {
      const data = await getData("sessionData");
      setSessionData(data);
    };
    fetchSessionData();
  }, []);
  const showMessageToast = ({ data }: { data: Message }) => {
    const toastMessage =
      data.userId === sessionData?.userId
        ? "Message Sent"
        : `${data.username} sent Message`;

    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        `🗨️ ${toastMessage}`,
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } else {
      Alert.alert("🗨️", toastMessage);
    }
  };
  const messages = useMessageSession(socket, showMessageToast);
  console.log("Messages:", messages);

  if (!sessionData || !socket) {
    console.log("Loading session data...");
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Loading...</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    console.log("Submitting message:", messageInput);
    const message = messageInput.trim();
    if (message === "") return;

    const messageData = {
      content: message,
      userId: sessionData.userId,
      username: sessionData.username,
    };

    socket?.emit("send-message", messageData);
    setMessageInput("");
    Keyboard.dismiss();
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
        className="w-full flex-1 bg-neutral-100"
        contentContainerClassName="p-4"
        ListEmptyComponent={
          <Text className="mt-4 text-center text-neutral-500">
            No messages yet. Start the conversation!
          </Text>
        }
        renderItem={({ item: msg, index }) => {
          const showUsername =
            msg.userId !== sessionData.userId &&
            (index === 0 || messages[index - 1].userId !== msg.userId);
          return (
            <View
              className={`mt-2 flex ${msg.userId === sessionData.userId ? "items-end" : "items-start"}`}
            >
              {showUsername && (
                <Text className="mb-1 text-sm">{msg.username}</Text>
              )}
              <Text
                className={`${
                  msg.userId === sessionData.userId
                    ? "rounded-br-2xl  rounded-tl-2xl bg-blue-400"
                    : "rounded-bl-2xl  rounded-tr-2xl bg-slate-200"
                } w-fit max-w-[70%]  break-words px-3 py-1 text-lg text-slate-800`}
              >
                {msg.content}
              </Text>
            </View>
          );
        }}
      />
      <View className="flex flex-row gap-2 bg-transparent p-4">
        <View className="flex-1">
          <TextInput
            onChangeText={setMessageInput}
            onBlur={() => {}}
            value={messageInput}
            placeholder="Type your message"
            placeholderTextColor="gray"
            className="flex-1 rounded-full bg-neutral-200 px-4 py-3 text-neutral-800"
          />
        </View>
        <Pressable
          onPress={handleSubmit}
          className="rounded-full bg-blue-400 p-4"
        >
          <AntDesign name="send" size={20} color="white" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
    // </TouchableWithoutFeedback>
  );
}
