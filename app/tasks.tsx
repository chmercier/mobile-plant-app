import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";
import typography from "../styles/typography";
import colors from "../styles/colors";

export default function Index() {
  return (
    <View style={styles.container}>
      <Header title="Tasks" />
      <View style={styles.content}>
        <Text style={typography.header}> Tasks </Text>
        <Text style={typography.body}>
          This is where you can manage your plant care tasks.
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
    paddingHorizontal: 30,
  },
});
