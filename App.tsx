import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import ViewPoduct from "./src/components/View";
// import { NotifierWrapper } from "react-native-notifier";
import Constants from 'expo-constants';
export default function App() {
  const { LAN_NETWORK } = Constants.expoConfig?.extra || {};
  console.log("LAN_NETWORK", LAN_NETWORK);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(`ws://${LAN_NETWORK}:8080/raw-ws`);

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
      ws.send(JSON.stringify({ message: "Hello from client!" })); // Gửi tin nhắn thử
    };

    ws.onmessage = (e) => {
      console.log("📨 Raw message:", e.data);
      try {
        const parsedData = JSON.parse(e.data);
        console.log("📦 Parsed message:", e.data);
        setMessages(parsedData); // Lưu tin nhắn vào state
      } catch (error) {
        console.error("❌ Error parsing message:", error);
      }
    };

    ws.onerror = (e) => {
      console.error("❌ WebSocket Error:", e);
    };

    ws.onclose = (e) => {
      console.log("❎ WebSocket Closed:", e.code, e.reason);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <SafeAreaProvider>
      {/* <NotifierWrapper> */}
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f3702110" }}>
          {/* các component chính */}
          <View style={styles.container}>
            {/* <View>
            <Text>{JSON.stringify(messages, null, 2)}</Text>
          </View> */}
            <ViewPoduct data={messages} />
          </View>
        </SafeAreaView>
      {/* </NotifierWrapper> */}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
