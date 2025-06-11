"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
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

const statutsEtudes = [
  "Pas commencée",
  "En cours",
  "Terminée"
]

const ModifierEtudeScreen = () => {
  const router = useRouter()
  const { etudeData } = useLocalSearchParams()
  
  const etude = etudeData ? JSON.parse(etudeData as string) : null
  
  const [formData, setFormData] = useState({
    titre: etude?.titre || "",
    description: etude?.description || "",
    prix: etude?.prix?.toString() || "",
    nbrIntervenant: etude?.nbrIntervenant?.toString() || "",
    dateDebut: etude?.dateDebut || "",
    dateFin: etude?.dateFin || "",
    dateCreation: etude?.dateCreation || "",
    imageUrl: etude?.image || ""
  })

  const [selectedType, setSelectedType] = useState(etude?.type || "")
  const [selectedStatut, setSelectedStatut] = useState(etude?.statut || "")

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    if (!formData.titre || !formData.description || !formData.prix || !selectedType) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }

    Alert.alert(
      "Succès", 
      "L'étude a été modifiée avec succès",
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
        <Text style={styles.headerTitle}>Modification de l'étude</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          
          {/* Formulaire */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.formContainer}>
            
            {/* Titre de l'étude */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="document-text-outline" size={20} color="#64748B" />
                <Text style={styles.label}>Titre de l'étude :</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.titre}
                onChangeText={(value) => handleInputChange("titre", value)}
                placeholder="Entrez le titre de l'étude"
                maxLength={50}
              />
            </View>

            {/* Date de publication */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="calendar-outline" size={20} color="#64748B" />
                <Text style={styles.label}>Date de publication :</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.dateCreation}
                onChangeText={(value) => handleInputChange("dateCreation", value)}
                placeholder="YYYY-MM-DD"
              />
            </View>

            {/* Type d'étude */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="library-outline" size={20} color="#64748B" />
                <Text style={styles.label}>Type d'étude :</Text>
              </View>
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

            {/* Dates */}
            <View style={styles.dateRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <View style={styles.labelContainer}>
                  <Ionicons name="play-outline" size={20} color="#64748B" />
                  <Text style={styles.label}>Date de début :</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={formData.dateDebut}
                  onChangeText={(value) => handleInputChange("dateDebut", value)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <View style={styles.labelContainer}>
                  <Ionicons name="stop-outline" size={20} color="#64748B" />
                  <Text style={styles.label}>Date de fin :</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={formData.dateFin}
                  onChangeText={(value) => handleInputChange("dateFin", value)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>

            {/* Prix */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="pricetag-outline" size={20} color="#64748B" />
                <Text style={styles.label}>Prix</Text>
              </View>
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
              <View style={styles.labelContainer}>
                <Ionicons name="people-outline" size={20} color="#64748B" />
                <Text style={styles.label}>Nombre d'intervenants :</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.nbrIntervenant}
                onChangeText={(value) => handleInputChange("nbrIntervenant", value)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            {/* Statut de l'étude */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#64748B" />
                <Text style={styles.label}>Statut de l'étude</Text>
              </View>
              <View style={styles.radioContainer}>
                {statutsEtudes.map((statut) => (
                  <TouchableOpacity
                    key={statut}
                    style={styles.radioOption}
                    onPress={() => setSelectedStatut(statut)}
                  >
                    <View style={[
                      styles.radioCircle,
                      selectedStatut === statut && styles.radioCircleSelected
                    ]}>
                      {selectedStatut === statut && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioText}>{statut}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="list-outline" size={20} color="#64748B" />
                <Text style={styles.label}>Description :</Text>
              </View>
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

          </Animated.View>

          {/* Bouton de modification */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.7}
            >
              <Text style={styles.submitButtonText}>Modifier l'étude</Text>
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
  },
  inputGroup: {
    marginBottom: 24,
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
  typeContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  typeButtonTextSelected: {
    color: "#FFFFFF",
  },
  dateRow: {
    flexDirection: "row",
  },
  radioContainer: {
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleSelected: {
    borderColor: "#3B82F6",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
  },
  radioText: {
    fontSize: 16,
    color: "#374151",
  },
  actionContainer: {
    paddingHorizontal: 20,
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})

export default ModifierEtudeScreen