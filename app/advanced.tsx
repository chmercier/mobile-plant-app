import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../components/Header";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import typography from "../styles/typography";

export default function AdvancedTips() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Advanced Tips for Plant-keeping", headerShown: false }} />
      <Header title="Advanced Tips"/>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>Light Management</Text>
        <Text style={styles.body}>
          Advanced plant-keeping starts with treating light as a measurable resource rather than a
          guess. Instead of “bright” or “low” light, think in lux or PPFD. A bright windowsill can
          be 20–40k lux at midday, while a meter back from that window may drop under 2k. Many
          foliage houseplants thrive around 5–10k lux for several hours; high-light species (herbs,
          succulents) prefer more. Even without instruments, you can
          improve outcomes by keeping leaves dust-free, rotating pots weekly for even growth, and
          using sheer curtains to soften harsh afternoon sun.
        </Text>
        <Text style={styles.title}>Watering Techniques</Text>

        <Text style={styles.body}>
          Watering is less about a calendar and more about substrate aeration and vapor pressure
          deficit (VPD). Roots need oxygen as much as moisture; a mix that stays soggy suffocates
          them. Use a finger test plus pot weight: lift the pot after a thorough watering to learn
          its “wet weight,” then water again only when it’s significantly lighter. For more
          precision, a basic moisture probe can teach relative patterns (avoid chasing exact numbers
          across different mixes). Managing VPD—how eager air is to pull moisture from leaves—helps
          prevent edema and crisping. In practice, keep rooms around 30–60% relative humidity for
          most tropicals, raising to 60–70% for finicky aroids, and adjust airflow so leaves dry
          within a couple of hours after misting or watering. Bottom-watering can encourage deeper
          roots, but flush from the top monthly to prevent salt buildup.
        </Text>

        <Text style={styles.title}>Soil Quality</Text>

        <Text style={styles.body}>
          Soil is a design choice, not a bag. Build mixes around your plant’s roots and your
          environment. For aroids (monstera, philodendron), try a chunky, airy base (bark,
          perlite/pumice, coco coir) that drains fast but holds humidity. For succulents, go gritty
          and lean with more pumice and coarse sand. If you grow in plastic pots in a humid home, go
          airier to avoid waterlogging; in terracotta or dry homes, add more coco or sphagnum for
          retention. Repot for function, not size: move up just 1–2 inches in diameter, prune
          circling roots, and reset the crown height to avoid stem rot. Refresh the top inch of mix
          between repots to keep nutrients and structure lively.
        </Text>
        <Text style={styles.title}>Plant Nutrition</Text>

        <Text style={styles.body}>
          Nutrition is best thought of as a steady drip, not feast and famine. A balanced fertilizer
          at 1/4–1/2 strength with every other watering works for most ornamentals; reduce in low
          light or winter. Advanced growers track electrical conductivity (EC) or parts per million
          (ppm) to avoid overfeeding—especially for semi-hydro systems like LECA. If you don’t want
          meters, watch for cues: pale new growth can signal nitrogen or iron issues; crispy tips
          often correlate with salts or low humidity; dark, limp leaves frequently indicate
          overwatering rather than nutrient lack. Water quality matters too: if your tap is very
          hard, consider filtered or rainwater to reduce leaf spotting and salt accumulation.
        </Text>
        <Text style={styles.title}>Pests</Text>

        <Text style={styles.body}>
          Integrated pest management (IPM) beats emergency sprays. Inspect weekly, flip leaves, check
          nodes, and isolate any plant with stippling, honeydew, or fuzz. A gentle, layered approach
          works: rinse leaves, wipe with diluted alcohol for mealybugs, then apply a mild
          insecticidal soap or horticultural oil, repeating on the egg cycle (every 5–7 days) until
          no new pests appear. Improve airflow and avoid overcrowding to reduce fungal issues.
          Quarantine new arrivals for two weeks. Sanitize shears between plants to prevent disease
          transfer. For fungus gnats, let the top inch dry between waterings, use sticky traps for
          monitoring, and consider a biological control like Bacillus thuringiensis israelensis.
        </Text>
        <Text style={styles.title}>Physical Structure</Text>

        <Text style={styles.body}>
          Structure and growth control make plants look “expert.” Stake climbing aroids early and
          give them a moss or bark pole to encourage larger, fenestrated leaves. Pinch herbs and
          trailers to promote branching, and prune to open the canopy for airflow. If growth is
          leggy, increase light rather than relying on constant cutting. Propagation keeps
          collections healthy and fun: take node cuttings with at least one node and leaf, root in
          water or a sterile perlite/coir mix with bright, indirect light, and transition gently to
          soil once roots are robust. Label cuttings with date and parent,small records prevent big
          mysteries later.
        </Text>
        <Text style={styles.title}>Plant Technology</Text>

        <Text style={styles.body}>
          Finally, build gentle automation and habits. A smart plug can run a humidifier on a
          schedule; a clip fan can keep air moving near dense foliage. Place sensors where leaves
          actually live, not on a distant shelf. Keep a simple log of watering, pruning, repotting,
          and pest checks, patterns emerge that explain successes and setbacks. Create microclimates:
          high-light plants near the brightest window with reflective surfaces, humidity-loving
          plants grouped together on trays, and tough, low-light species deeper in the room. Whether
          you’re a beginner or advanced, the throughline is the same: measure what you can, observe
          what you can’t, adjust one variable at a time, and let the plant’s new growth tell you if
          you’re on the right track.
        </Text>

        <Text style={styles.body}>
        </Text>
        <Text style={styles.body}>
            We know this is a lot to take in, don't be alarmed. You don't need to master absolutely everything in this section. Mastering even a few of these advanced techniques will significantly enhance your plant-keeping knowledge and lead to healthier, happier plants.
            Take your time and enjoy the journey!

        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  content: { padding: 20, gap: 10 },
  title: { ...typography.header, fontSize: 20, fontFamily: fonts.bold, },
  body: { ...typography.body, color: colors.textPrimary },
});