import { useRouter } from "expo-router";
import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PlantCard from "../components/PlantCard";
import colors from "../styles/colors";
import typography from "../styles/typography";

type Task = { id: string; plant: string; type: "water" | "fertilize" | "mist"; dueIn: string };

const UPCOMING: Task[] = [
  { id: "1", plant: "Monstera Deliciosa", type: "water", dueIn: "in 3 days" },
  { id: "2", plant: "Snake Plant", type: "mist", dueIn: "tomorrow" },
  { id: "3", plant: "Fiddle Leaf Fig", type: "fertilize", dueIn: "in 1 week" },
];

export default function Home() {
  const router = useRouter();
  const nextTask = UPCOMING[0];

  return (
    <View style={styles.container}>
      {/* Top text header */}
      <View style={styles.header}>
        <Text style={styles.homeTitle}>HOME</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>
        {/* Greeting / blurb */}
        <Text style={[typography.header, { textAlign: "center", marginBottom: 6 }]}>
          Welcome to Sprouts!
        </Text>
        <Text style={[typography.body, { textAlign: "center", marginBottom: 16 }]}>
          Let's take care of your plants and never make them miss you, shall we?
        </Text>

        {/* Example featured plant */}
        <PlantCard
          title="Monstera Deliciosa"
          image={require("../assets/images/monstera.jpg")}
          nextTask={{ type: "water", timeUntilTask: "3d" }}
        />

        {/* Next Task summary */}
        <View style={styles.nextTask}>
          <Text style={styles.sectionTitle}>Next task</Text>
          <Text style={typography.body}>
            {nextTask.plant}: {prettyTask(nextTask.type)} {nextTask.dueIn}.
          </Text>
        </View>

        {/* Upcoming tasks */}
        <View style={styles.upcoming}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <FlatList
            data={UPCOMING}
            keyExtractor={(t) => t.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <View style={styles.taskRow}>
                <Text style={styles.taskPlant}>{item.plant}</Text>
                <Text style={styles.taskMeta}>
                  {prettyTask(item.type)} • {item.dueIn}
                </Text>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>

        {/* Learn Tiles */}
        <Text style={styles.sectionTitle}>Learn</Text>
        <View style={styles.tilesGrid}>
          <TouchableOpacity
            style={styles.squareTile}
            onPress={() => router.push("/sprouts")}
            activeOpacity={0.85}
          >
            <Text style={styles.tileTitle}>Intro to Sprouts</Text>
            <Text style={styles.tileSubtitle}>Start here</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.squareTile}
            onPress={() => router.push("/beginner")}
            activeOpacity={0.85}
          >
            <Text style={styles.tileTitle}>Beginner Plant-keeping</Text>
            <Text style={styles.tileSubtitle}>Tap for Tips!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.squareTile}
            onPress={() => router.push("/advanced")}
            activeOpacity={0.85}
          >
            <Text style={styles.tileTitle}>Advanced Tips</Text>
            <Text style={styles.tileSubtitle}>Plant-keeping</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.squareTile, { backgroundColor: colors.accent }]}
            onPress={() => router.push("/plants")}
            activeOpacity={0.85}
          >
            <Text style={[styles.tileTitle, { color: colors.textOnDark }]}>+ Add a plant</Text>
            <Text style={[styles.tileSubtitle, { color: colors.textOnDark }]}>Open camera</Text>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.push("/tasks")}>
            <Text style={styles.ctaText}>View all tasks</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function prettyTask(t: Task["type"]) {
  switch (t) {
    case "water": return "Water";
    case "fertilize": return "Fertilize";
    case "mist": return "Mist";
    default: return "Task";
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },

  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  homeTitle: {
    fontFamily: "LiberationSans-Bold",
    fontSize: 32,
    color: colors.textPrimary,
    letterSpacing: 1,
  },

  contentScroll: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 40,
  },

  sectionTitle: {
    ...typography.header,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 8,
  },

  nextTask: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },

  upcoming: { marginTop: 12, paddingVertical: 8 },

  taskRow: { paddingVertical: 10 },
  taskPlant: { ...typography.body, fontWeight: "600", color: colors.textPrimary, marginBottom: 2 },
  taskMeta: { ...typography.body, color: colors.textSecondary },

  separator: { height: 1, backgroundColor: colors.surface, opacity: 0.6 },

  tilesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  squareTile: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    justifyContent: "space-between",
  },
  tileTitle: {
    ...typography.header,
    color: colors.textOnDark,
    fontSize: 18,
  },
  tileSubtitle: {
    ...typography.body,
    color: colors.textOnDark,
  },

  ctaRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  ctaButton: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  ctaText: { color: colors.textOnDark, fontFamily: "LiberationSans-Bold", fontSize: 16 },
});
