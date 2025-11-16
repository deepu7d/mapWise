import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import JoinForm from "./JoinForm";
import CreateRoom from "./createFrom";

export default function MainForm() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={50}
        className="w-full flex-1 justify-center bg-slate-100"
      >
        {/* navbar */}
        <View className="mb-5 flex flex-row justify-center gap-10">
          <TouchableOpacity onPress={() => setIsAdmin(true)}>
            <Text
              className={`${isAdmin ? "border-b-2 border-blue-500 text-blue-500" : ""}  text-xl`}
            >
              Create Room
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsAdmin(false)}>
            <Text
              className={`${isAdmin ? "" : "border-b-2 border-blue-500 text-blue-500"} text-xl`}
            >
              Join Room
            </Text>
          </TouchableOpacity>
        </View>
        {isAdmin ? <CreateRoom /> : <JoinForm />}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
