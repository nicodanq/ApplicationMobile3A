"use client"

import { useSession } from "@/contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useCallback, useEffect, useRef } from "react"
import { 
  Animated, 
  StatusBar, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  Platform
} from "react-native"

// Constantes pour une meilleure maintenabilité
const ANIMATION_CONFIG = {
  TITLE_DURATION: 600,
  SUBTITLE_DURATION: 500,
  BUTTON_DURATION: 500,
  SIGNOUT_DURATION: 400,
  DELAYS: {
    SUBTITLE: 200,
    BUTTON: 400,
    SIGNOUT: 600
  }
}

const COLORS = {
  BACKGROUND: "#F8FAFC",
  PRIMARY: "#3B82F6",
  TEXT_PRIMARY: "#1E293B",
  TEXT_SECONDARY: "#475569",
  TEXT_MUTED: "#64748B",
  WHITE: "#FFFFFF"
}

export default function HomeScreen() {
  const router = useRouter()
  const { signOut } = useSession()

  // Regroupement des références d'animation
  const animations = useRef({
    title: {
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(-20)
    },
    subtitle: {
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(-15)
    },
    button: {
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.8)
    },
    signOut: {
      opacity: new Animated.Value(0)
    }
  }).current

  // Fonction d'animation réutilisable
  const createFadeInAnimation = useCallback((
    animatedValues: { opacity: Animated.Value; translateY?: Animated.Value },
    duration: number,
    delay: number = 0
  ) => {
    const animationsArray = [
      Animated.timing(animatedValues.opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      })
    ]

    if (animatedValues.translateY) {
      animationsArray.push(
        Animated.timing(animatedValues.translateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        })
      )
    }

    return Animated.sequence([
      Animated.delay(delay),
      Animated.parallel(animationsArray)
    ])
  }, [])

  // Animation du bouton avec spring pour plus de fluidité
  const createButtonAnimation = useCallback(() => {
    return Animated.sequence([
      Animated.delay(ANIMATION_CONFIG.DELAYS.BUTTON),
      Animated.parallel([
        Animated.timing(animations.button.opacity, {
          toValue: 1,
          duration: ANIMATION_CONFIG.BUTTON_DURATION,
          useNativeDriver: true,
        }),
        Animated.spring(animations.button.scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ])
    ])
  }, [animations.button])

  useEffect(() => {
    // Orchestration des animations avec une approche plus maintenable
    const animationSequence = Animated.stagger(0, [
      createFadeInAnimation(animations.title, ANIMATION_CONFIG.TITLE_DURATION),
      createFadeInAnimation(animations.subtitle, ANIMATION_CONFIG.SUBTITLE_DURATION, ANIMATION_CONFIG.DELAYS.SUBTITLE),
      createButtonAnimation(),
      createFadeInAnimation(animations.signOut, ANIMATION_CONFIG.SIGNOUT_DURATION, ANIMATION_CONFIG.DELAYS.SIGNOUT)
    ])

    animationSequence.start()

    // Cleanup function pour arrêter les animations si le composant est démonté
    return () => {
      animationSequence.stop()
    }
  }, [createFadeInAnimation, createButtonAnimation, animations])

  const handleNavigation = useCallback(() => {
    router.push("/(tabs)/etudes")
  }, [router])

  const handleSignOut = useCallback(() => {
    signOut()
  }, [signOut])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND} />

      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: animations.title.opacity,
            transform: [{ translateY: animations.title.translateY }],
          },
        ]}
      >
        <Text 
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel="Titre de bienvenue"
        >
          Bienvenue 👋
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.subtitleContainer,
          {
            opacity: animations.subtitle.opacity,
            transform: [{ translateY: animations.subtitle.translateY }],
          },
        ]}
      >
        <Text 
          style={styles.subtitle}
          accessibilityLabel="Description de l'application"
        >
          Cette application vous permet de découvrir et de postuler à nos études en cours. Et bien d'autres fonctionnalités vous attendent.
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: animations.button.opacity,
            transform: [{ scale: animations.button.scale }],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleNavigation}
          accessibilityRole="button"
          accessibilityLabel="Voir les études disponibles"
          accessibilityHint="Navigue vers la liste des études"
          activeOpacity={0.8}
        >
          <Ionicons 
            name="book-outline" 
            size={20} 
            color={COLORS.WHITE} 
            style={styles.buttonIcon} 
          />
          <Text style={styles.buttonText}>Voir les études</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.signOutContainer,
          {
            opacity: animations.signOut.opacity,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel="Se déconnecter"
          activeOpacity={0.7}
        >
          <Text style={styles.signOutText}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
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
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitleContainer: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 160,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
  signOutContainer: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  signOutText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
    textDecorationLine: "underline",
  },
})