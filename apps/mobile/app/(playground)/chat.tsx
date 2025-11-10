import { useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { sessionData } from "@repo/types";
import { useMessageSession, useSocket } from "@repo/hooks";

export default function Chat() {
  const socket = useSocket("https://bfxz3hqs-8000.inc1.devtunnels.ms");
  // console.log("Socket connected:", socket);
  const sessionData: sessionData = {
    roomId: "test-room",
    userId: "user-123",
    username: "JohnDoe",
    destinationPosition: [37.7749, -122.4194],
    destinationName: "San Francisco",
  };
  const messages = useMessageSession(socket, sessionData);
  const [messageInput, setMessageInput] = useState("");
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={100}
        className="w-full flex-1 justify-center bg-slate-100"
      >
        <View className="flex-1 bg-blue-50 ">
          <Text className="text-2xl p-2">Chat Here</Text>
          <View className="bg-neutral-300 flex-1 w-full rounded-t-3xl p-4 flex">
            {messages.map((msg, index) => (
              <Text key={index} className="pb-2"></Text>
            ))}
          </View>
          <View className="flex flex-row">
            <View className="flex-grow">
              <TextInput
                onChangeText={setMessageInput}
                onBlur={() => {}}
                value={messageInput}
                placeholder="Type your message"
                className="text-neutral-900 px-4"
              />
            </View>
            <Button title="Send Message" onPress={handleSubmit} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
