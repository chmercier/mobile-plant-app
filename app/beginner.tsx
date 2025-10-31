import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../components/Header";
import colors from "../styles/colors";
import typography from "../styles/typography";


export default function BeginnerInfo() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Beginner's Almanac :)", headerShown: false }} />
      <Header title="Beginner Information" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.body}>
          Welcome! Before we begin, here are a few pillars to get started:
        </Text>
        <Text style={styles.bullet}>• Light: learn your plant’s native light needs (bright/indirect vs low).</Text>
        <Text style={styles.bullet}>• Water: water deeply, then let the topsoil dry as appropriate for the species.</Text>
        <Text style={styles.bullet}>• Drainage: always use a pot with a drainage hole; avoid standing water.</Text>
        <Text style={styles.bullet}>• Soil: match correct mix to plant type (airy for aroids, gritty for succulents).
            It is important to measure moisture with your finger to get an accurate idea of when to water.
            This will help prevent over/underwatering.
        </Text>
        <Text style={styles.bullet}>• Humidity: many tropicals like {">"}50% — pebble tray or small humidifier helps.</Text>
        <Text style={styles.bullet}>• Inspection: check leaves weekly for pests or stress (spots, curl, yellowing).
            A useful tool for avoiding watering is inspecting the weight of the pot; a dry pot will be significantly lighter than a well-watered one.
        </Text>
        <Text style={styles.body}>
         
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
  bullet: { ...typography.body },
});