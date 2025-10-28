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
import { Message } from "@repo/types";
import { useJoinRoom, useSocket } from "@repo/hooks";

export default function Chat() {
  const socket = useSocket("https://bfxz3hqs-8000.inc1.devtunnels.ms");
  console.log("Socket connected:", socket);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const onSubmit = () => {
    if (messageInput.trim() === "") return;
    console.log("Message sent:", messageInput);
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
            <Button title="Send Message" onPress={onSubmit} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
