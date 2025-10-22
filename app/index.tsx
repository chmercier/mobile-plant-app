import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "./components/Header";
import typography from "./styles/typography";
import fonts from "./styles/fonts";
import { useFonts } from "expo-font";
import colors from "./styles/colors";

export default function Index() {
  const [fontsLoaded] = useFonts({
    [fonts.regular]: require("../assets/fonts/LiberationSans-Regular.ttf"),
    [fonts.italic]: require("../assets/fonts/LiberationSans-Italic.ttf"),
    [fonts.bold]: require("../assets/fonts/LiberationSans-Bold.ttf"),
    [fonts.boldItalic]: require("../assets/fonts/LiberationSans-BoldItalic.ttf"),
  });

  return (
    <View style={styles.container}>
      <Header title="Home" />
      <View style={styles.content}>
        <Text style={typography.header}>
          {" "}
          Welcome to the Mobile Plant App!{" "}
        </Text>
        <Text style={typography.body}>
          This is a simple app to help you manage your plants on the go.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full screen
    justifyContent: "flex-start", // Center vertically
    alignItems: "center", // Center horizontally
    backgroundColor: colors.backgroundLight,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
});
