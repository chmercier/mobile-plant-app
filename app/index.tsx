import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/Header";
import PlantCard from "../components/PlantCard";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
/*
type Taskss = { id: string; plant: string; type: "water" | "fertilize" | "mist"; dueIn: string };

const UPCOMING: Task[] = [
  { id: "1", plant: "Monstera Deliciosa", type: "water", dueIn: "in 3 days" },
  { id: "2", plant: "Snake Plant", type: "mist", dueIn: "tomorrow" },
  { id: "3", plant: "Fiddle Leaf Fig", type: "fertilize", dueIn: "in 1 week" },
];
*/
interface Task {
  id: string;
  title: string;
  plantName?: string;
  description?: string;
  dueDate: Date;
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: "daily" | "2-3 days" | "4-5 days" | "weekly" | "biweekly" | "monthly";
  };
  isCompleted: boolean;
  completedDate?: Date;
  createdDate: Date;
  parentTaskId?: string;
}

const STORAGE_KEY = "@plant_care_tasks";

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadTasks(); // refresh
    }, [])
  );


  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const withDates = parsed.map((t: any) => ({
          ...t,
          dueDate: new Date(t.dueDate),
        }));
        setTasks(withDates);
      }
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) return "today";
    if (compareDate.getTime() === tomorrow.getTime()) return "tomorrow";

    const diff = Math.ceil((compareDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0 && diff <= 7) return `in ${diff} day${diff > 1 ? "s" : ""}`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const sorted = [...tasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  const upcoming = sorted.filter((t) => !t.isCompleted);
  const nextTask = upcoming[0] || null;

  return (
    <View style={styles.container}>
      <Header title="Home" />
      <ScrollView
        contentContainerStyle={styles.contentScroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Welcome to Sprouts</Text>
        <Text style={styles.subtext}>
          Let’s take care of your plants and make sure they never miss you!
        </Text>

        {/* Example featured plant (static for now) */}
        <View style={{ alignItems: "center" }}>
          <PlantCard
            title="Monstera Deliciosa"
            image={require("../assets/images/monstera.jpg")}
            nextTask={{
              type: "water",
              timeUntilTask: nextTask ? formatDate(nextTask.dueDate) : " ",
            }}/>

        </View>

        {/* Next Task */}
        <View style={styles.nextTaskBox}>
          <Text style={styles.nextTaskTitle}>Next Task</Text>
          {nextTask ? (
            <Text style={styles.nextTaskBody}>
              {nextTask.title}
              {nextTask.plantName ? ` (${nextTask.plantName})` : ""} due {formatDate(nextTask.dueDate)}.
            </Text>
          ) : (
            <Text style={styles.nextTaskBody}>No tasks at this time.</Text>
          )}
        </View>

        <View style={[styles.banner, { backgroundColor: colors.surface }]}>
          <Text style={[styles.bannerTitle, { color: colors.textOnDark }]}>Upcoming Tasks</Text>
          {upcoming.length > 0 ? (
            <FlatList
              data={upcoming}
              keyExtractor={(t) => t.id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <View style={styles.taskRow}>
                  <Text style={[styles.taskPlant, { color: colors.textOnDark }]}>
                    {item.title} {item.plantName ? `(${item.plantName})` : ""}
                  </Text>
                  <Text style={[styles.taskMeta, { color: colors.textOnDark }]}>
                    Due {formatDate(item.dueDate)}
                  </Text>
                </View>
              )}
              scrollEnabled={false}
            />
          ) : (
            <Text style={[styles.nextTaskBody, { color: colors.textOnDark }]}>
              No tasks at this time.
            </Text>
          )}
        </View>

        {/* Learn Section */}
        <View style={[styles.banner, { backgroundColor: colors.backgroundDark }]}>
          <Text style={[styles.bannerTitle, { color: colors.textOnDark }]}>Learn</Text>
          <View style={styles.tilesGrid}>
            <TouchableOpacity
              style={[styles.squareTile, { backgroundColor: colors.surface }]}
              onPress={() => router.push("/sprouts")}
              activeOpacity={0.85}
            >
              <Text style={[styles.tileTitle, { color: colors.textOnDark }]}>Intro to Sprouts</Text>
              <Text style={[styles.tileSubtitle, { color: colors.textOnDark }]}>Start here</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.squareTile, { backgroundColor: colors.surface }]}
              onPress={() => router.push("/beginner")}
              activeOpacity={0.85}
            >
              <Text style={[styles.tileTitle, { color: colors.textOnDark }]}>Beginner Tips</Text>
              <Text style={[styles.tileSubtitle, { color: colors.textOnDark }]}>Tap for help</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.squareTile, { backgroundColor: colors.surface }]}
              onPress={() => router.push("/advanced")}
              activeOpacity={0.85}
            >
              <Text style={[styles.tileTitle, { color: colors.textOnDark }]}>Advanced Tips</Text>
              <Text style={[styles.tileSubtitle, { color: colors.textOnDark }]}>Plant care</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.squareTile, { backgroundColor: colors.accent }]}
              onPress={() => router.push("/plants")}
              activeOpacity={0.85}
            >
              <Text style={[styles.tileTitle, { color: colors.textOnDark }]}>+ Add a Plant</Text>
              <Text style={[styles.tileSubtitle, { color: colors.textOnDark }]}>Open Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  contentScroll: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 60,
    alignItems: "center",
  },
  greeting: {
    textAlign: "center",
    fontSize: 26,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 6,
  },
  subtext: {
    textAlign: "center",
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 16,
    marginBottom: 16,
  },
  nextTaskBox: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  nextTaskTitle: {
    fontSize: 20,
    color: colors.textOnDark,
    fontFamily: fonts.bold,
    marginBottom: 8,
    textAlign: "center",
  },
  nextTaskBody: {
    color: colors.textOnDark,
    fontFamily: fonts.regular,
    textAlign: "center",
    fontSize: 16,
  },
  banner: {
    width: "100%",
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
  },
  bannerTitle: {
    fontFamily: fonts.bold,
    fontSize: 22,
    textAlign: "center",
    marginBottom: 12,
  },
  taskRow: { paddingVertical: 10 },
  taskPlant: {
    fontFamily: fonts.bold,
    fontSize: 16,
    marginBottom: 2,
  },
  taskMeta: {
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  separator: { height: 1, backgroundColor: colors.textOnDark, opacity: 0.3 },
  tilesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  squareTile: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 12,
    padding: 14,
    justifyContent: "space-between",
  },
  tileTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
  },
  tileSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
  },
});