"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
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
} from "react-native"
import { useState } from "react"
import Animated, { FadeInDown } from "react-native-reanimated"

import FooterLogo from "@/components/FooterLogo"

const typesEtudes = [
  "IT & Digital",
  "Ingénierie des systèmes", 
  "Conseil",
  "RSE",
  "Digital & Culture",
  "Traduction Technique"
]

const CreerEtudeScreen = () => {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    nbrIntervenant: "",
    dateDebut: "",
    dateFin: "",
    typeEtude: "",
    imageUrl: ""
  })

  const [selectedType, setSelectedType] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    // Validation basique
    if (!formData.titre || !formData.description || !formData.prix || !selectedType) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }

    // Ici vous pouvez ajouter la logique pour sauvegarder l'étude
    Alert.alert(
      "Succès", 
      "L'étude a été créée avec succès",
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
        <Text style={styles.headerTitle}>Créer une Étude</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          
          {/* Formulaire */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.formContainer}>
            
            {/* Titre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Titre de l'étude *</Text>
              <TextInput
                style={styles.input}
                value={formData.titre}
                onChangeText={(value) => handleInputChange("titre", value)}
                placeholder="Entrez le titre de l'étude"
                maxLength={50}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => handleInputChange("description", value)}
                placeholder="Décrivez l'étude en détail"
                multiline
                numberOfLines={4}
                maxLength={200}
              />
            </View>

            {/* Type d'étude */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type d'étude *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeContainer}>
                {typesEtudes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      selectedType === type && styles.typeButtonSelected
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      selectedType === type && styles.typeButtonTextSelected
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Prix */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prix (€) *</Text>
              <TextInput
                style={styles.input}
                value={formData.prix}
                onChangeText={(value) => handleInputChange("prix", value)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            {/* Nombre d'intervenants */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre d'intervenants *</Text>
              <TextInput
                style={styles.input}
                value={formData.nbrIntervenant}
                onChangeText={(value) => handleInputChange("nbrIntervenant", value)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            {/* Dates */}
            <View style={styles.dateRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Date de début</Text>
                <TextInput
                  style={styles.input}
                  value={formData.dateDebut}
                  onChangeText={(value) => handleInputChange("dateDebut", value)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Date de fin</Text>
                <TextInput
                  style={styles.input}
                  value={formData.dateFin}
                  onChangeText={(value) => handleInputChange("dateFin", value)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>

            {/* URL Image */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>URL de l'image</Text>
              <TextInput
                style={styles.input}
                value={formData.imageUrl}
                onChangeText={(value) => handleInputChange("imageUrl", value)}
                placeholder="https://example.com/image.jpg"
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
              <Text style={styles.submitButtonText}>Créer l'étude</Text>
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
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  typeContainer: {
    flexDirection: "row",
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  typeButtonSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  typeButtonText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  typeButtonTextSelected: {
    color: "#FFFFFF",
  },
  dateRow: {
    flexDirection: "row",
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

export default CreerEtudeScreen