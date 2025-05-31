"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function HomeScreen() {
  const router = useRouter()

  const handleNavigation = () => {
    router.push("/(tabs)/etudes")
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>Bienvenue 👋</Text>
      <Text style={styles.subtitle}>Cette application vous permet de découvrir et de postuler à nos études en cours. Et bien d&apos;autres</Text>

      <TouchableOpacity style={styles.button} onPress={handleNavigation}>
        <Ionicons name="book-outline" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Voir les études</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})