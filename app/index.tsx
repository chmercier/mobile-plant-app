import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";
import PlantCard from "../components/PlantCard";
import typography from "../styles/typography";
import colors from "../styles/colors";

export default function Index() {
  return (
    <View style={styles.container}>
      <Header title="Home" />
      <View style={styles.content}>
        <Text style={typography.header}>
          Welcome to the Mobile Plant App!{" "}
        </Text>
        <PlantCard
          title="Monstera Deliciosa"
          image={require("../assets/images/monstera.jpg")}
          nextTask={{ type: "water", timeUntilTask: "3d" }} 
        />
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
    paddingHorizontal: 30,
  },
});
