"use client"

import api from "@/api/axiosClient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import FooterLogo from "@/components/FooterLogo";

const CreerUtilisateurScreen = () => {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    prenom_user: "",
    nom_user: "",
    email_user: "",
    mdp_user: "",
    bio_user: "",
    github_user: "",
    dateNaissance: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    // Validation basique
    if (!formData.prenom_user || !formData.nom_user || !formData.email_user || !formData.mdp_user) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email_user)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide")
      return
    }

    // Ici vous pouvez ajouter la logique pour créer l'utilisateur
    await api.post("/user/", {
      prenom_user: formData.prenom_user,
      nom_user: formData.nom_user,
      email_user: formData.email_user,
      mdp_user: formData.mdp_user,
      bio_user: formData.bio_user,
      github_user: formData.github_user,
      dateNaissance: formData.dateNaissance,
      statut_user: 1, // Par défaut, on crée l'utilisateur avec le statut actif
    })
    // Afficher un message de succès


    Alert.alert(
      "Succès", 
      "L'utilisateur a été créé avec succès",
      [{ text: "OK", onPress: () => router.back() }]
    )
  }

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
        <Text style={styles.headerTitle}>Créer un utilisateur</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          
          {/* Formulaire */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.formContainer}>
            
            {/* Prénom */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="person-outline" size={20} color="#64748B" />
                <Text style={styles.label}>Prénom *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.prenom_user}
                onChangeText={(value) => handleInputChange("prenom_user", value)}
                placeholder="Entrez le prénom"
                maxLength={50}
              />
            </View>

            {/* Nom */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="person-outline" size={20} color="#64748B" />
                <Text style={styles.label}>Nom *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.nom_user}
                onChangeText={(value) => handleInputChange("nom_user", value)}
                placeholder="Entrez le nom"
                maxLength={50}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="mail-outline" size={20} color="#64748B" />
                <Text style={styles.label}>Email *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.email_user}
                onChangeText={(value) => handleInputChange("email_user", value)}
                placeholder="exemple@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                maxLength={50}
              />
            </View>

            {/* Mot de passe */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
                <Text style={styles.label}>Mot de passe *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.mdp_user}
                onChangeText={(value) => handleInputChange("mdp_user", value)}
                placeholder="Entrez le mot de passe"
                secureTextEntry
                maxLength={50}
              />
            </View>

            {/* Date de naissance */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="calendar-outline" size={20} color="#64748B" />
                <Text style={styles.label}>Date de naissance</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.dateNaissance}
                onChangeText={(value) => handleInputChange("dateNaissance", value)}
                placeholder="YYYY-MM-DD"
              />
            </View>

            {/* GitHub */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="logo-github" size={20} color="#64748B" />
                <Text style={styles.label}>GitHub</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.github_user}
                onChangeText={(value) => handleInputChange("github_user", value)}
                placeholder="https://github.com/username"
                autoCapitalize="none"
                maxLength={50}
              />
            </View>

            {/* Biographie */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="document-text-outline" size={20} color="#64748B" />
                <Text style={styles.label}>Biographie</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.bio_user}
                onChangeText={(value) => handleInputChange("bio_user", value)}
                placeholder="Décrivez l'utilisateur..."
                multiline
                numberOfLines={3}
                maxLength={50}
              />
            </View>

          </Animated.View>

          {/* Boutons d'action */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.7}
            >
              <Text style={styles.submitButtonText}>Créer l&apos;utilisateur</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </ScrollView>

      <FooterLogo />
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginLeft: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 12,
    paddingHorizontal: 4,
    fontSize: 16,
    color: "#000000",
    backgroundColor: "transparent",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})

export default CreerUtilisateurScreen