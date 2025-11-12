import { sessionData } from "@repo/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

type sessionKey = "sessionData";

export const storeData = async (key: sessionKey, value: sessionData) => {
  try {
    const jsonValue = JSON.stringify(value); // Stringify the object
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Failed to save data.", e);
  }
};

export const getData = async (key: sessionKey) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue); // Parse the string back into an object
      return data;
    } else {
      console.log("No data found for this key.");
      return null;
    }
  } catch (e) {
    console.error("Failed to read data.", e);
  }
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)} sec`;
  }
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hr ${remainingMinutes} min`;
};
