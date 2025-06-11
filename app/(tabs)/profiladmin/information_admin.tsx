"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
} from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

import FooterLogo from "@/components/FooterLogo"

const MesInformationsAdminScreen = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes informations</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          
          {/* Photo de profil */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.avatarSection}>
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Changer la photo</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Informations personnelles */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom complet</Text>
              <TextInput
                style={styles.input}
                value="Admin Système"
                placeholder="Votre nom complet"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value="admin@plateforme.com"
                placeholder="Votre email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Téléphone</Text>
              <TextInput
                style={styles.input}
                value="+33 6 12 34 56 78"
                placeholder="Votre numéro de téléphone"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Rôle</Text>
              <View style={styles.roleContainer}>
                <Text style={styles.roleText}>Administrateur</Text>
                <View style={styles.roleBadge}>
                  <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Informations de contact */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <Text style={styles.sectionTitle}>Informations de contact</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Adresse</Text>
              <TextInput
                style={styles.input}
                value="123 Rue de l'Administration"
                placeholder="Votre adresse"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ville</Text>
              <TextInput
                style={styles.input}
                value="Paris"
                placeholder="Votre ville"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Code postal</Text>
              <TextInput
                style={styles.input}
                value="75001"
                placeholder="Code postal"
                keyboardType="numeric"
              />
            </View>
          </Animated.View>

          {/* Bouton de sauvegarde */}
          <Animated.View entering={FadeInDown.delay(400)}>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Sauvegarder les modifications</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>

        <FooterLogo />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 20,
  },
  avatarSection: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  changePhotoButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#3B82F6",
    borderRadius: 20,
  },
  changePhotoText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
  },
  roleText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  roleBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default MesInformationsAdminScreen