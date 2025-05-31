"use client"

import { useSession } from "@/contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native"

interface FormData {
  email: string
  password: string
  newsletter: boolean
}

const LoginScreen: React.FC = () => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useSession()
  const router = useRouter()

  // Animations existantes
  const logoScale = useRef(new Animated.Value(1)).current

  // Nouvelles animations d'apparition
  const logoOpacity = useRef(new Animated.Value(0)).current
  const logoTranslateY = useRef(new Animated.Value(-30)).current
  const titleOpacity = useRef(new Animated.Value(0)).current
  const titleTranslateY = useRef(new Animated.Value(-20)).current
  const subtitleOpacity = useRef(new Animated.Value(0)).current
  const subtitleTranslateY = useRef(new Animated.Value(-15)).current
  const formOpacity = useRef(new Animated.Value(0)).current
  const formTranslateY = useRef(new Animated.Value(20)).current

  useEffect(() => {
    // Animation du logo (apparition)
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Démarrer l'animation de pulsation après l'apparition
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoScale, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    })

    // Animation du titre (avec délai)
    setTimeout(() => {
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
    }, 300)

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
    }, 500)

    // Animation du formulaire (avec délai)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(formTranslateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start()
    }, 700)
  }, [])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      newsletter: false,
    },
  })

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data)
    // Ajouter logique de connexion ici
    signIn()
    // Navigate after signing in. You may want to tweak this to ensure sign-in is
    // successful before navigating.
    router.replace("/")
  }

  const theme = {
    background: isDark ? "#1a1a2e" : "#ffffff",
    surface: isDark ? "#2d2d44" : "#ffffff",
    text: isDark ? "#ffffff" : "#333333",
    textSecondary: isDark ? "#b0b0b0" : "#666666",
    border: isDark ? "#404040" : "#e0e0e0",
    primary: "#4a90e2",
    primaryLight: "#6ba5e9",
    success: "#4caf50",
    error: "#f44336",
    shadow: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)",
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoTranslateY }],
          },
        ]}
      >
        <Animated.View style={[styles.logoWrapper, { transform: [{ scale: logoScale }] }]}>
          <Image
            source={require("../../assets/images/EPF_Projets_Logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
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
        <Text style={[styles.welcomeTitle, { color: theme.text }]}>Welcome to EPF Projets!</Text>
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
        <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>Keep your data safe</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.formContainer,
          {
            opacity: formOpacity,
            transform: [{ translateY: formTranslateY }],
          },
        ]}
      >
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email requis",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email invalide",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? "#252547" : "#f5f5f5",
                    borderColor: errors.email ? theme.error : "transparent",
                    color: theme.text,
                  },
                ]}
                placeholder="Email"
                placeholderTextColor={theme.textSecondary}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && <Text style={[styles.errorText, { color: theme.error }]}>{errors.email.message}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.passwordContainer}>
            <Controller
              control={control}
              name="password"
              rules={{ required: "Mot de passe requis" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? "#252547" : "#f5f5f5",
                      borderColor: errors.password ? theme.error : "transparent",
                      color: theme.text,
                    },
                  ]}
                  placeholder="Password"
                  placeholderTextColor={theme.textSecondary}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPassword}
                />
              )}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={[styles.errorText, { color: theme.error }]}>{errors.password.message}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>Forgot password?</Text>
        </TouchableOpacity>

        <Controller
          control={control}
          name="newsletter"
          render={({ field: { onChange, value } }) => (
            <TouchableOpacity style={styles.checkboxRow} onPress={() => onChange(!value)}>
              <View
                style={[
                  styles.checkbox,
                  { borderColor: theme.border },
                  value && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
              >
                {value && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={[styles.checkboxText, { color: theme.textSecondary }]}>
                J&apos;accepte de recevoir les dernières offres et actualités par mail
              </Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logoContainer: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  titleContainer: {
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitleContainer: {
    marginBottom: 40,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 17,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
})

export default LoginScreen
export const unstable_settings = {
  ignoreFiles: ["app/(tabs)/profil.tsx"],
}
