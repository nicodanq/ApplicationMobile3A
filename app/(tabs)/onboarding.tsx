"use client";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface WelcomeScreenProps {
  onNavigateToLogin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigateToLogin }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(30)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.8)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1200,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(imageScale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(buttonTranslateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotation, {
          toValue: 0.02,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: -0.02,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const logoSpin = logoRotation.interpolate({
    inputRange: [-0.02, 0.02],
    outputRange: ["-2deg", "2deg"],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Image with Overlay */}
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require("../../assets/images/welcome-background.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={[
              "rgba(74, 144, 226, 0.4)",
              "rgba(74, 144, 226, 0.5)",
              "rgba(26, 26, 46, 0.7)",
            ]}
            style={styles.overlay}
          />
        </ImageBackground>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.logoSection}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScale }, { rotate: logoSpin }],
              },
            ]}
          >
            <View style={styles.imageBackground}>
              <Image
                source={require("../../assets/images/EPF_Projets_Logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslateY }],
              },
            ]}
          >
            <Text style={styles.welcomeText}>Bienvenue</Text>
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
            <Text style={styles.brandText}>EPF Projets</Text>
            <Text style={styles.taglineText}>Votre avenir commence ici</Text>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.featureImageContainer,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            },
          ]}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: "/placeholder.svg?height=200&width=300" }}
              style={styles.featureImage}
              resizeMode="cover"
            />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonOpacity,
              transform: [{ translateY: buttonTranslateY }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.loginButton}
            onPress={onNavigateToLogin}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#4a90e2", "#357abd"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Se connecter</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="white"
                style={styles.buttonIcon}
              />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.additionalActions}>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                Découvrir nos projets
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      <View style={styles.floatingElements}>
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.floatingDot,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.1,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
    paddingBottom: 50,
    justifyContent: "space-between",
  },
  logoSection: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 30,
  },
  imageBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  titleContainer: {
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleContainer: {
    alignItems: "center",
  },
  brandText: {
    fontSize: 28,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  taglineText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontStyle: "italic",
  },
  featureImageContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  imageWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  featureImage: {
    width: width - 60,
    height: 200,
  },
  buttonContainer: {
    alignItems: "center",
  },
  loginButton: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#4a90e2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  additionalActions: {
    alignItems: "center",
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  floatingElements: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  floatingDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },
});

export default WelcomeScreen;

export const unstable_settings = {
  initialRouteName: "welcome",
};
