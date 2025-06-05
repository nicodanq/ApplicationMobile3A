"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const EtudesScreen = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes études</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Buttons */}
          <TouchableOpacity style={styles.studyButton}>
            <Text style={styles.studyButtonText}>Postulées</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.studyButton}>
            <Text style={styles.studyButtonText}>En cours</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.studyButton}>
            <Text style={styles.studyButtonText}>Terminées</Text>
          </TouchableOpacity>

          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop" }}
              style={styles.teamImage}
            />
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
    paddingTop: 40,
  },
  studyButton: {
    backgroundColor: "#5A7A95",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  studyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  imageContainer: {
    marginTop: 40,
    borderRadius: 15,
    overflow: "hidden",
  },
  teamImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
})

export default EtudesScreen
