"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
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

const ModifierInformationsScreen = () => {
  const router = useRouter()

  // États pour les champs modifiables
  const [formData, setFormData] = useState({
    prenom: "Lina",
    nom: "BENABDELOUAHED",
    telephone: "+33 6 12 34 56 78",
    dateNaissance: "15/04/1998",
    adresse: "3 rue des Ingénieurs, 75015 Paris",
    biographie:
      "Étudiante passionnée par l'ingénierie des systèmes et l'innovation technologique. Toujours à la recherche de nouveaux défis et d'opportunités d'apprentissage.",
    lienGithub: "https://github.com/lina-benabdelouahed",
  })

  const handleSave = () => {
    // Ici vous pouvez ajouter la logique pour sauvegarder les modifications
    Alert.alert("Succès", "Vos informations ont été mises à jour avec succès !", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ])
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier mes informations</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Informations personnelles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Prénom</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.prenom}
                  onChangeText={(value) => updateField("prenom", value)}
                  placeholder="Entrez votre prénom"
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.nom}
                  onChangeText={(value) => updateField("nom", value)}
                  placeholder="Entrez votre nom"
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date de naissance</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.dateNaissance}
                  onChangeText={(value) => updateField("dateNaissance", value)}
                  placeholder="JJ/MM/AAAA"
                />
              </View>
            </View>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Adresse email</Text>
                <View style={styles.disabledInput}>
                  <Text style={styles.disabledText}>lina.benabdelouahed@epf.fr</Text>
                  <View style={styles.lockBadge}>
                    <Ionicons name="lock-closed" size={14} color="#64748B" />
                  </View>
                </View>
                <Text style={styles.helperText}>L'adresse email ne peut pas être modifiée</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Téléphone</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.telephone}
                  onChangeText={(value) => updateField("telephone", value)}
                  placeholder="Entrez votre numéro de téléphone"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Adresse</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.adresse}
                  onChangeText={(value) => updateField("adresse", value)}
                  placeholder="Entrez votre adresse"
                  multiline
                />
              </View>
            </View>
          </View>

          {/* Autres informations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Autres informations</Text>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Biographie</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.biographie}
                  onChangeText={(value) => updateField("biographie", value)}
                  placeholder="Parlez-nous de vous..."
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Lien Github</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.lienGithub}
                  onChangeText={(value) => updateField("lienGithub", value)}
                  placeholder="https://github.com/votre-nom"
                  keyboardType="url"
                />
              </View>
            </View>
          </View>

          {/* Boutons d'action */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} activeOpacity={0.8}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Sauvegarder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  inputGroup: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
    fontWeight: "500",
  },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  disabledInput: {
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  disabledText: {
    fontSize: 16,
    color: "#64748B",
    flex: 1,
  },
  lockBadge: {
    backgroundColor: "#E2E8F0",
    padding: 6,
    borderRadius: 6,
  },
  helperText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cancelButtonText: {
    color: "#64748B",
    fontSize: 16,
    fontWeight: "600",
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ModifierInformationsScreen
