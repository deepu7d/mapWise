import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { sessionData } from "@repo/types";
import { useMessageSession, useSocketContext } from "@repo/hooks";

export default function Chat() {
  const socket = useSocketContext();
  const sessionData: sessionData = {
    roomId: "cmht0yeau0000m6rloumdy1iw",
    userId: "cmht0z3ox0004m6rljv6em956",
    username: "mobile",
    destinationPosition: [30.357234, 76.7951835],
    destinationName: "Jandli, Ambala Cantt, Ambala, Haryana, 132004, India",
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
        keyboardVerticalOffset={50}
        className="w-full flex-1 justify-center"
      >
        <View className="flex-1 bg-white">
          <Text className="text-2xl p-4 font-bold">Chat Here</Text>
          <ScrollView className="bg-neutral-50 border border-neutral-300/50 w-full rounded-t-3xl p-4">
            {messages.map((msg, index) => {
              const showUsername =
                msg.userId !== sessionData.userId &&
                (index === 0 || messages[index - 1].userId !== msg.userId);
              return (
                <View
                  key={msg.id}
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
            })}
          </ScrollView>
          <View className="flex flex-row z-10">
            <View className="flex-1  border border-neutral-200/50">
              <TextInput
                onChangeText={setMessageInput}
                onBlur={() => {}}
                value={messageInput}
                placeholder="Type your message"
                className="text-neutral-900 px-4 bg-white flex-1"
              />
            </View>
            <Pressable
              onPress={handleSubmit}
              className="self-center p-4 bg-blue-400"
            >
              <Text>Send</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
