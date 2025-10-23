import React from "react";
import { Tabs } from "expo-router";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import fonts from "../styles/fonts";
import colors from "../styles/colors";

export default function Layout() {
  // Load fonts once globally
  const [fontsLoaded] = useFonts({
    [fonts.regular]: require("../assets/fonts/LiberationSans-Regular.ttf"),
    [fonts.bold]: require("../assets/fonts/LiberationSans-Bold.ttf"),
  });

  // While fonts are loading, show nothing
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.backgroundDark,
        tabBarInactiveTintColor: colors.accent,
        tabBarStyle: { backgroundColor: colors.surface },
        tabBarItemStyle: { justifyContent: "center" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plants"
        options={{
          title: "Plants",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
