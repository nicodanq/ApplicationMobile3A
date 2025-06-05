"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

const InformationsScreen = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes informations</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Prénom" placeholderTextColor="#999" />
          </View>

          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Nom" placeholderTextColor="#999" />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Adresse email"
              placeholderTextColor="#999"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Mot de passe"
                placeholderTextColor="#999"
                secureTextEntry
              />
              <TouchableOpacity style={styles.eyeButton}>
                <Ionicons name="eye-off-outline" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Date de naissance" placeholderTextColor="#999" />
          </View>

          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Biographie" placeholderTextColor="#999" multiline />
          </View>

          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Lien Github" placeholderTextColor="#999" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    fontSize: 16,
    color: "#000",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 15,
  },
  eyeButton: {
    padding: 5,
  },
})

export default InformationsScreen
