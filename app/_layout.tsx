import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import colors from "../styles/colors";

export default function Layout() {
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
      <Tabs.Screen name="beginner" options={{ href: null }} />
      <Tabs.Screen name="sprouts" options={{ href: null }} />
      <Tabs.Screen name="advanced" options={{ href: null }} />
      <Tabs.Screen name="plantsdetails" options={{ href: null }} />
    </Tabs>
  );
}
