import React from "react";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { Text, View, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PlantCardProps {
  title: string;
  image: any;
  nextTask: {
    type: "water" | "fertilize";
    timeUntilTask: string; // e.g., "1-2w", "3d"
  };
}

export default function PlantCard({ title, image, nextTask }: PlantCardProps) {
  const renderTaskIcon = (type: string) => {
    switch (type) {
      case "water":
        return <Ionicons name="water" size={16} color={colors.textOnDark} />;
      case "fertilize":
        return <Ionicons name="leaf" size={16} color={colors.textOnDark} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.nextTaskContainer}>
        {renderTaskIcon(nextTask.type)}
        <Text style={styles.nextTask}>{nextTask.timeUntilTask}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
    margin: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    position: "absolute",
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textOnDark,
    textAlign: "left",
    textShadowColor: "#000", // Shadow color
    textShadowOffset: { width: 0, height: 1 }, // Shadow offset
    textShadowRadius: 2, // Blur radius
    padding: 15,
  },
  nextTaskContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  nextTask: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textOnDark,
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginLeft: 6,
  },
});
