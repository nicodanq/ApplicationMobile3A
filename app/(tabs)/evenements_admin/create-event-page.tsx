"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Button } from "../../../components/button"
import { Card, CardContent } from "../../../components/card"

import HeaderPage from "@/components/HeaderPage"
import FooterLogo from "@/components/FooterLogo"

// Types
type EventFormData = {
  titre: string
  categorie: string
  date: string
  lieu: string
  heure: string
  description: string
}

// Mapping des catégories vers les IDs de votre base de données
const categories = [
  { id: "1", label: "Technologie", color: "#3B82F6", icon: "code-slash" },
  { id: "2", label: "Carrière", color: "#10B981", icon: "briefcase" },
  { id: "3", label: "Conférence", color: "#EC4899", icon: "mic" },
  { id: "4", label: "Atelier", color: "#06B6D4", icon: "construct" },
  { id: "5", label: "Portes ouvertes", color: "#8B5CF6", icon: "school" },
  { id: "6", label: "Recherche", color: "#F59E0B", icon: "flask" },
]

interface CreateEventPageProps {
  onBack: () => void
  onSave?: (eventData: EventFormData) => void
}

const CreateEventPage = ({ onBack, onSave }: CreateEventPageProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    titre: "",
    categorie: "",
    date: "",
    lieu: "",
    heure: "",
    description: "",
  })

  const [errors, setErrors] = useState<Partial<EventFormData>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Fonction pour obtenir l'URL de l'API Firebase Functions
  const getApiUrl = () => {
    // Pour Firebase Functions Emulator
    // Remplacez 192.168.1.XXX par votre vraie adresse IP locale
    const LOCAL_IP = "192.168.147.224" // REMPLACEZ par votre vraie IP

    if (__DEV__) {
      // En mode développement avec Firebase Functions Emulator
      return `http://${LOCAL_IP}:5001/projet3a-app/us-central1/api`
    } else {
      // En production avec Firebase Functions déployées
      return "https://us-central1-projet3a-app.cloudfunctions.net/api"
    }
  }

  // Fonction pour valider une date au format YYYY-MM-DD
  const isValidDate = (dateString: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return false
    }

    const parts = dateString.split("-")
    const year = Number.parseInt(parts[0], 10)
    const month = Number.parseInt(parts[1], 10) - 1
    const day = Number.parseInt(parts[2], 10)

    const date = new Date(year, month, day)
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
  }

  const isPastDate = (dateString: string): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const parts = dateString.split("-")
    const year = Number.parseInt(parts[0], 10)
    const month = Number.parseInt(parts[1], 10) - 1
    const day = Number.parseInt(parts[2], 10)

    const date = new Date(year, month, day)
    return date < today
  }

  const getDateErrorMessage = (dateString: string): string | null => {
    if (!dateString.trim()) {
      return "La date est requise"
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return "Format de date invalide. Utilisez YYYY-MM-DD (ex: 2023-12-31)"
    }

    const parts = dateString.split("-")
    const year = Number.parseInt(parts[0], 10)
    const month = Number.parseInt(parts[1], 10)
    const day = Number.parseInt(parts[2], 10)

    if (year < 2000 || year > 2100) {
      return `Année invalide: ${year}. Utilisez une année entre 2000 et 2100`
    }

    if (month < 1 || month > 12) {
      return `Mois invalide: ${month}. Le mois doit être entre 1 et 12`
    }

    const daysInMonth = new Date(year, month, 0).getDate()

    if (day < 1 || day > daysInMonth) {
      return `Jour invalide: ${day}. ${month === 2 ? "Février" : "Ce mois"} ${year} a ${daysInMonth} jours`
    }

    if (!isValidDate(dateString)) {
      return "Date invalide. Vérifiez que la date existe réellement"
    }

    if (isPastDate(dateString)) {
      return "La date est dans le passé. Choisissez une date future"
    }

    return null
  }

  const isValidTime = (timeString: string): boolean => {
    return /^(\d{1,2}h(\d{2})?)(\s*-\s*\d{1,2}h(\d{2})?)?$/.test(timeString)
  }

  const validateForm = () => {
    const newErrors: Partial<EventFormData> = {}

    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est requis"
    } else if (formData.titre.length < 3) {
      newErrors.titre = "Le titre doit contenir au moins 3 caractères"
    }

    if (!formData.categorie) {
      newErrors.categorie = "La catégorie est requise"
    }

    const dateError = getDateErrorMessage(formData.date)
    if (dateError) {
      newErrors.date = dateError
    }

    if (!formData.lieu.trim()) {
      newErrors.lieu = "Le lieu est requis"
    }

    if (!formData.heure.trim()) {
      newErrors.heure = "L'horaire est requis"
    } else if (!isValidTime(formData.heure)) {
      newErrors.heure = "Format d'horaire invalide. Utilisez par exemple: 10h, 10h30 ou 10h - 12h"
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise"
    } else if (formData.description.length < 10) {
      newErrors.description = "La description doit contenir au moins 10 caractères"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true)

        const API_URL = getApiUrl()
        const ENDPOINT = `${API_URL}/events/create` // L'endpoint complet sera : http://IP:5001/projet3a-app/us-central1/api/events/create

        console.log("🚀 Début de la création d'événement...")
        console.log("🌐 URL complète:", ENDPOINT)
        console.log("📝 Données envoyées:", {
          titre: formData.titre,
          description: formData.description,
          date: formData.date,
          horaire: formData.heure,
          lieu: formData.lieu,
          typeEvenementId: Number.parseInt(formData.categorie),
        })

        // Test de connectivité d'abord
        console.log("🔍 Test de connectivité...")

        const response = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            titre: formData.titre,
            description: formData.description,
            date: formData.date,
            horaire: formData.heure,
            lieu: formData.lieu,
            typeEvenementId: Number.parseInt(formData.categorie),
          }),
          // Timeout pour éviter d'attendre trop longtemps
          signal: AbortSignal.timeout(10000), // 10 secondes
        })

        console.log("📡 Statut de la réponse:", response.status)
        console.log("📡 Headers de la réponse:", response.headers)

        let result
        try {
          result = await response.json()
          console.log("📄 Réponse du serveur:", result)
        } catch (jsonError) {
          console.error("❌ Erreur lors du parsing JSON:", jsonError)
          throw new Error("Réponse du serveur invalide (pas de JSON)")
        }

        if (response.ok) {
          console.log("✅ Événement créé avec succès!")
          Alert.alert("Succès", "Événement créé avec succès !", [
            {
              text: "OK",
              onPress: () => {
                setFormData({
                  titre: "",
                  categorie: "",
                  date: "",
                  lieu: "",
                  heure: "",
                  description: "",
                })
                onBack()
              },
            },
          ])
        } else {
          let errorMessage = "Erreur inconnue"

          if (result && result.message) {
            const errorMsg = result.message.toLowerCase()

            if (
              errorMsg.includes("date") ||
              errorMsg.includes("jour") ||
              errorMsg.includes("mois") ||
              errorMsg.includes("année")
            ) {
              if (errorMsg.includes("format")) {
                errorMessage = "Format de date incorrect. Utilisez YYYY-MM-DD"
              } else if (errorMsg.includes("passé") || errorMsg.includes("future")) {
                errorMessage = "La date doit être dans le futur"
              } else if (errorMsg.includes("invalid")) {
                errorMessage = "Date invalide. Vérifiez que cette date existe réellement"
              } else {
                errorMessage = `Problème avec la date: ${result.message}`
              }
            } else if (errorMsg.includes("horaire") || errorMsg.includes("heure")) {
              errorMessage = `Problème avec l'horaire: ${result.message}`
            } else {
              switch (response.status) {
                case 400:
                  errorMessage = `Données invalides: ${result.message}`
                  break
                case 401:
                  errorMessage = "Non autorisé - Vérifiez vos permissions"
                  break
                case 403:
                  errorMessage = "Accès interdit - Vous n'avez pas les droits"
                  break
                case 404:
                  errorMessage = "Endpoint non trouvé - Vérifiez l'URL de votre API"
                  break
                case 500:
                  errorMessage = `Erreur serveur: ${result.message}`
                  break
                case 502:
                  errorMessage = "Serveur indisponible (Bad Gateway)"
                  break
                case 503:
                  errorMessage = "Service temporairement indisponible"
                  break
                default:
                  errorMessage = `Erreur ${response.status}: ${result.message}`
              }
            }
          }

          console.error(`❌ Erreur ${response.status}:`, errorMessage)
          Alert.alert("Erreur de création", errorMessage)
        }
      } catch (error: any) {
        console.error("💥 Erreur complète:", error)

        let userMessage = "Erreur inconnue"
        let debugInfo = ""

        if (error.name === "AbortError") {
          userMessage = "Timeout: Le serveur met trop de temps à répondre"
          debugInfo = "Vérifiez que votre serveur Express est démarré et accessible"
        } else if (error.name === "TypeError" && error.message.includes("Network request failed")) {
          userMessage = "Impossible de contacter le serveur"
          debugInfo = `URL utilisée: ${getApiUrl()}\n\nVérifiez:\n• Que votre serveur Express est démarré\n• Que l'adresse IP est correcte\n• Que vous êtes sur le même réseau`
        } else if (error.message.includes("fetch")) {
          userMessage = "Erreur de connexion réseau"
          debugInfo = "Vérifiez votre connexion internet et l'URL du serveur"
        } else if (error.code === "ECONNREFUSED") {
          userMessage = "Connexion refusée par le serveur"
          debugInfo = "Le serveur n'est probablement pas démarré sur le port 3000"
        } else if (error.code === "ENOTFOUND") {
          userMessage = "Serveur introuvable"
          debugInfo = "Vérifiez l'adresse IP de votre serveur"
        } else {
          userMessage = `Erreur technique: ${error.message}`
          debugInfo = `Type: ${error.name}`
        }

        Alert.alert("Erreur de connexion", userMessage, [
          {
            text: "Voir les détails",
            onPress: () => {
              Alert.alert(
                "Informations de debug",
                `${debugInfo}\n\nURL: ${getApiUrl()}/events/create\n\nErreur: ${error.message}`,
              )
            },
          },
          { text: "OK" },
        ])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const updateFormData = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateDateOnBlur = () => {
    if (formData.date) {
      const dateError = getDateErrorMessage(formData.date)
      if (dateError) {
        setErrors((prev) => ({ ...prev, date: dateError }))
      }
    }
  }

  const selectedCategory = categories.find((cat) => cat.id === formData.categorie)

  return (
    <View style={styles.container}>
      <HeaderPage title="Création d'un événement" />

      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvel événement</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Affichage de l'URL pour debug */}
        {process.env.NODE_ENV === "development" && (
          <Card style={[styles.formCard, { backgroundColor: "#FEF3C7" }]}>
            <CardContent style={styles.formContent}>
              <Text style={styles.debugText}>🔧 Mode Debug</Text>
              <Text style={styles.debugText}>URL API: {getApiUrl()}/events/create</Text>
            </CardContent>
          </Card>
        )}

        <Card style={styles.formCard}>
          <CardContent style={styles.formContent}>
            {/* Titre */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Ionicons name="create-outline" size={20} color="#64748B" />
                <Text style={styles.fieldLabel}>Titre de l'événement :</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.titre && styles.inputError]}
                value={formData.titre}
                onChangeText={(value) => updateFormData("titre", value)}
                placeholder="Entrez le titre de l'événement"
                placeholderTextColor="#94A3B8"
                editable={!isLoading}
              />
              {errors.titre && <Text style={styles.errorText}>{errors.titre}</Text>}
            </View>

            {/* Catégorie */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Ionicons name="pricetag-outline" size={20} color="#64748B" />
                <Text style={styles.fieldLabel}>Type d'événement :</Text>
              </View>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      formData.categorie === category.id && {
                        backgroundColor: category.color,
                        borderColor: category.color,
                      },
                    ]}
                    onPress={() => updateFormData("categorie", category.id)}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={16}
                      color={formData.categorie === category.id ? "#FFFFFF" : category.color}
                    />
                    <Text
                      style={[styles.categoryText, formData.categorie === category.id && styles.categoryTextSelected]}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.categorie && <Text style={styles.errorText}>{errors.categorie}</Text>}
            </View>

            {/* Date */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Ionicons name="calendar-outline" size={20} color="#64748B" />
                <Text style={styles.fieldLabel}>Date :</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.date && styles.inputError]}
                value={formData.date}
                onChangeText={(value) => updateFormData("date", value)}
                onBlur={validateDateOnBlur}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
                editable={!isLoading}
              />
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
              <Text style={styles.helperText}>Format: AAAA-MM-JJ (ex: 2023-12-31)</Text>
            </View>

            {/* Lieu */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Ionicons name="location-outline" size={20} color="#64748B" />
                <Text style={styles.fieldLabel}>Lieu :</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.lieu && styles.inputError]}
                value={formData.lieu}
                onChangeText={(value) => updateFormData("lieu", value)}
                placeholder="Lieu de l'événement"
                placeholderTextColor="#94A3B8"
                editable={!isLoading}
              />
              {errors.lieu && <Text style={styles.errorText}>{errors.lieu}</Text>}
            </View>

            {/* Horaire */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Ionicons name="time-outline" size={20} color="#64748B" />
                <Text style={styles.fieldLabel}>Horaire :</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.heure && styles.inputError]}
                value={formData.heure}
                onChangeText={(value) => updateFormData("heure", value)}
                placeholder="Ex: 10h - 17h"
                placeholderTextColor="#94A3B8"
                editable={!isLoading}
              />
              {errors.heure && <Text style={styles.errorText}>{errors.heure}</Text>}
              <Text style={styles.helperText}>Format: 10h, 10h30 ou 10h - 17h</Text>
            </View>

            {/* Description */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Ionicons name="document-text-outline" size={20} color="#64748B" />
                <Text style={styles.fieldLabel}>Description :</Text>
              </View>
              <TextInput
                style={[styles.textAreaInput, errors.description && styles.inputError]}
                value={formData.description}
                onChangeText={(value) => updateFormData("description", value)}
                placeholder="Description détaillée de l'événement"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!isLoading}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>
          </CardContent>
        </Card>

        {/* Aperçu */}
        {formData.titre && selectedCategory && (
          <Card style={styles.previewCard}>
            <CardContent style={styles.previewContent}>
              <Text style={styles.previewTitle}>Aperçu</Text>
              <View style={styles.previewEvent}>
                <View style={[styles.previewIcon, { backgroundColor: selectedCategory.color }]}>
                  <Ionicons name={selectedCategory.icon as any} size={20} color="#FFFFFF" />
                </View>
                <View style={styles.previewDetails}>
                  <Text style={[styles.previewEventTitle, { color: selectedCategory.color }]}>{formData.titre}</Text>
                  {formData.description && (
                    <Text style={styles.previewDescription} numberOfLines={2}>
                      {formData.description}
                    </Text>
                  )}
                  <View style={styles.previewMeta}>
                    {formData.date && (
                      <View style={styles.previewMetaItem}>
                        <Ionicons name="calendar-outline" size={12} color="#64748B" />
                        <Text style={styles.previewMetaText}>{formData.date}</Text>
                      </View>
                    )}
                    {formData.heure && (
                      <View style={styles.previewMetaItem}>
                        <Ionicons name="time-outline" size={12} color="#64748B" />
                        <Text style={styles.previewMetaText}>{formData.heure}</Text>
                      </View>
                    )}
                    {formData.lieu && (
                      <View style={styles.previewMetaItem}>
                        <Ionicons name="location-outline" size={12} color="#64748B" />
                        <Text style={styles.previewMetaText}>{formData.lieu}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        )}

        <View style={styles.buttonContainer}>
          <Button
            variant="outline"
            onPress={onBack}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onPress={handleSave}
            style={[
              styles.saveButton,
              { backgroundColor: selectedCategory?.color || "#3B82F6" },
              isLoading && styles.disabledButton,
            ]}
            disabled={isLoading}
          >
            {isLoading ? "Création..." : "Ajouter l'événement"}
          </Button>
        </View>

        <FooterLogo />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formCard: {
    marginBottom: 20,
  },
  formContent: {
    padding: 20,
  },
  debugText: {
    fontSize: 12,
    color: "#92400E",
    marginBottom: 4,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
    minHeight: 100,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  helperText: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  categoryText: {
    fontSize: 14,
    color: "#64748B",
    marginLeft: 6,
  },
  categoryTextSelected: {
    color: "#FFFFFF",
  },
  previewCard: {
    marginBottom: 20,
  },
  previewContent: {
    padding: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
  previewEvent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  previewDetails: {
    flex: 1,
  },
  previewEventTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  previewDescription: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
    lineHeight: 20,
  },
  previewMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  previewMetaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewMetaText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
  },
  cancelButtonText: {
    color: "#64748B",
  },
  saveButton: {
    flex: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
})

export default CreateEventPage
