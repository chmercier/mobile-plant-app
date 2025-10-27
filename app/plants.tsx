import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";
import typography from "../styles/typography";
import colors from "../styles/colors";

export default function Plants() {
    return (
        <View style={styles.container}>
            <Header title="Plants" />
            <View style={styles.content}>
                <Text style={typography.header}> Your Plant Collection </Text>
                <Text style={typography.body}>
                    Here you can view and manage all your plants.
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