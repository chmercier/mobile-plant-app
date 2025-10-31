import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import colors from "../styles/colors";
import type { Plant } from "./plants";

const { width, height } = Dimensions.get("window");

export default function PlantsDetails() {
  const params = useLocalSearchParams();
  let parsedPlant: Plant | null = null;

  try {
    const paramValue = Array.isArray(params.plant)
      ? params.plant[0]
      : params.plant;

    if (paramValue && typeof paramValue === "string" && paramValue !== "undefined") {
      parsedPlant = JSON.parse(paramValue);
    }
  } catch (e) {
    console.warn("Error parsing plant param:", e);
  }

  if (!parsedPlant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Could not load plant details. Please go back and try again.
        </Text>
      </View>
    );
  }

  const sunlightValue = Array.isArray(parsedPlant.sunlight)
    ? parsedPlant.sunlight.join(", ")
    : parsedPlant.sunlight || "Unknown";

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>  
        </Text>
      <Text style={styles.title}>{parsedPlant.name}</Text>


      {/* User photo */}
      <Image
        source={{ uri: parsedPlant.uri }}
        style={styles.mainImage}
        resizeMode="cover"
      />

      {/* API reference image */}
      {parsedPlant.referenceImage && (
        <Image
          source={{ uri: parsedPlant.referenceImage }}
          style={styles.apiImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.infoBox}>
        <Text style={styles.label}>💧 Watering:</Text>
        <Text style={styles.value}>{parsedPlant.watering || "Unknown"}</Text>

        <Text style={styles.label}>☀️ Sunlight:</Text>
        <Text style={styles.value}>{sunlightValue}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginVertical: 15,
  },
  mainImage: {
    width: width * 0.92, // leaves border on sides
    height: height * 0.55,
    borderRadius: 15,
    alignSelf: "center",
    marginVertical: 10,
  },
  apiImage: {
    width: width * 0.92,
    height: height * 0.45,
    borderRadius: 15,
    alignSelf: "center",
    marginVertical: 10,
  },
  infoBox: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textOnDark,
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    padding: 30,
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: 18,
    textAlign: "center",
  },
});
