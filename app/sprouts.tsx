import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import colors from "../styles/colors";
import typography from "../styles/typography";

export default function SproutsIntro() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Introduction to Sprouts App :)", headerShown: true }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Hey, you!</Text>
        <Text style={styles.body}>Welcome to our brand-new app: Sprouts!
            This app is designed to help plant enthusiasts of all levels take better care of their green friends
            while also teaching how to become a more knowledgeable plant parent. Here, you'll find features to track watering schedules,
            get care reminders, and access a wealth of information on various plant species. Utilizing your camera to capture photos of your plants,
            you can save and set up reminders for your very own personal plants and their care routines. Peruse the home page to find beginner tips, advanced care techniques, and everything in between.
            Thank you and good luck on your journey, let's keep those plants happy!
        </Text>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  content: { padding: 20, gap: 10 },
  title: { ...typography.header, fontSize: 26 },
  body: { ...typography.body, color: colors.textPrimary },
});