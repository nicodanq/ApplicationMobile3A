"use client"

import { useSession } from "@/contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useRef } from "react"
import { Animated, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function HomeScreen() {
  const router = useRouter()
  const { signOut } = useSession()

  // Références pour les animations
  const titleOpacity = useRef(new Animated.Value(0)).current
  const titleTranslateY = useRef(new Animated.Value(-20)).current
  const subtitleOpacity = useRef(new Animated.Value(0)).current
  const subtitleTranslateY = useRef(new Animated.Value(-15)).current
  const buttonOpacity = useRef(new Animated.Value(0)).current
  const buttonScale = useRef(new Animated.Value(0.8)).current
  const signOutOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animation du titre
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()

    // Animation du sous-titre (avec délai)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start()
    }, 200)

    // Animation du bouton (avec délai)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start()
    }, 400)

    // Animation du lien Sign Out (avec délai)
    setTimeout(() => {
      Animated.timing(signOutOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start()
    }, 600)
  }, [])

  const handleNavigation = () => {
    router.push("/(tabs)/etudes")
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
      >
        <Text style={styles.title}>Bienvenue 👋</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.subtitleContainer,
          {
            opacity: subtitleOpacity,
            transform: [{ translateY: subtitleTranslateY }],
          },
        ]}
      >
        <Text style={styles.subtitle}>
          Cette application vous permet de découvrir et de postuler à nos études en cours. Et bien d&apos;autres
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonOpacity,
            transform: [{ scale: buttonScale }],
          },
        ]}
      >
        <TouchableOpacity style={styles.button} onPress={handleNavigation}>
          <Ionicons name="book-outline" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Voir les études</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.signOutContainer,
          {
            opacity: signOutOpacity,
          },
        ]}
      >
        <Text
          style={styles.signOutText}
          onPress={() => {
            // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
            signOut()
          }}
        >
          Sign Out
        </Text>
      </Animated.View>
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
  titleContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },
  subtitleContainer: {
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutContainer: {
    marginTop: 16,
  },
  signOutText: {
    color: "#64748B",
    fontSize: 14,
    textDecorationLine: "underline",
  },
})
