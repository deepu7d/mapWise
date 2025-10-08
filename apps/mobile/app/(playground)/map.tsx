import React from "react";
import { StyleSheet, StatusBar, View } from "react-native";
import { WebView } from "react-native-webview";

// The URL from your deployed web application
const remoteWebAppUrl = "https://qs9pjlmq-3000.inc1.devtunnels.ms/map"; // <--- CHANGE THIS URL

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <WebView
        style={styles.webview}
        source={{ uri: remoteWebAppUrl }} // <-- THIS IS THE ONLY CHANGE
        // You might not need all the file access props anymore,
        // but they don't hurt to keep.
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
  },
});
