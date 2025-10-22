import React from "react";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { Text, View, StyleSheet } from "react-native";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundDark,
  },
  text: {
    fontFamily: fonts.bold,
    color: colors.textOnDark,
    fontSize: 36,
  },
});
