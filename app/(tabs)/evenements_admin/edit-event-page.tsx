"use client"

import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useEffect, useState } from "react"
import { Alert, BackHandler, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { Button } from "../../../components/button"
import { Card, CardContent } from "../../../components/card"

import FooterLogo from "@/components/FooterLogo"

import api from "@/api/axiosClient"

// Types
type EventFormData = {
  titre: string
  categorie: string
  date: string
  lieu: string
  heure: string
  description: string
}

type Evenement = {
  id: string
  date: string
  titre: string
  heure: string
  lieu: string
  description: string
  categorie?: string
  color: string
  gradientColors: [string, string]
}

// Mapping des catégories vers les IDs de votre base de données
const categories = [
  { id: "1", label: "Formation", color: "#007AFF", icon: "school" },
  { id: "2", label: "Afterwork", color: "#34C759", icon: "wine" },
  { id: "3", label: "Forum", color: "#FF2D92", icon: "people" },
]

interface EditEventPageProps {
  event: Evenement
  onBack: () => void
  onSave: (eventId: string, eventData: EventFormData) => void
}

const EditEventPage = ({ event, onBack, onSave }: EditEventPageProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    titre: "",
    categorie: "",
    date: "",
    lieu: "",
    heure: "",
    description: "",
  })

  const [errors, setErrors] = useState<Partial<EventFormData>>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fonction pour convertir la catégorie de l'événement vers l'ID
  const getCategorieId = (categorie?: string): string => {
    switch (categorie) {
      case "formation":
        return "1"
      case "afterwork":
        return "2"
      case "forum":
        return "3"
      default:
        return "1"
    }
  }

  // Pré-remplir le formulaire avec les données de l'événement
  useEffect(() => {
    if (event) {
      setFormData({
        titre: event.titre,
        categorie: getCategorieId(event.categorie),
        date: event.date,
        lieu: event.lieu,
        heure: event.heure,
        description: event.description,
      })
    }
  }, [event])

  // Gestion du bouton retour du téléphone
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (hasChanges) {
          Alert.alert(
            "Modifications non sauvegardées",
            "Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?",
            [
              { text: "Rester", style: "cancel" },
              { text: "Quitter", style: "destructive", onPress: onBack },
            ],
          )
          return true
        }
        onBack()
        return true // Empêche le comportement par défaut
      }

      const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress)

      return () => backHandler.remove()
    }, [onBack, hasChanges]),
  )

  // Validation de l'heure au format "14h30" ou "9h"
  const isValidHeure = (heureString: string): boolean => {
    const cleaned = heureString.trim().toLowerCase()
    return /^(\d{1,2})h(\d{2})?$/.test(cleaned)
  }

  const getHeureErrorMessage = (heureString: string): string | null => {
    if (!heureString.trim()) {
      return "L'heure est requise"
    }

    const cleaned = heureString.trim().toLowerCase()
    const match = cleaned.match(/^(\d{1,2})h(\d{2})?$/)

    if (!match) {
      return "Format d'heure invalide. Utilisez: 9h, 14h, 9h30, 14h45"
    }

    const heures = Number.parseInt(match[1], 10)
    const minutes = match[2] ? Number.parseInt(match[2], 10) : 0

    if (heures < 0 || heures > 23) {
      return "Les heures doivent être entre 0 et 23"
    }

    if (minutes < 0 || minutes > 59) {
      return "Les minutes doivent être entre 0 et 59"
    }

    return null
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

  const validateForm = () => {
    const newErrors: Partial<EventFormData> = {}

    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est requis"
    } else if (formData.titre.length < 3) {
      newErrors.titre = "Le titre doit contenir au moins 3 caractères"
    } else if (formData.titre.length > 50) {
      newErrors.titre = "Le titre ne peut pas dépasser 50 caractères"
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
    } else if (formData.lieu.length > 50) {
      newErrors.lieu = "Le lieu ne peut pas dépasser 50 caractères"
    }

    const heureError = getHeureErrorMessage(formData.heure)
    if (heureError) {
      newErrors.heure = heureError
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise"
    } else if (formData.description.length < 10) {
      newErrors.description = "La description doit contenir au moins 10 caractères"
    } else if (formData.description.length > 50) {
      newErrors.description = "La description ne peut pas dépasser 50 caractères"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true)

        console.log("🚀 Début de la modification d'événement...")
        console.log("📝 Données envoyées:", {
          titre: formData.titre,
          description: formData.description,
          date: formData.date,
          horaire: formData.heure,
          lieu: formData.lieu,
          typeEvenementId: Number.parseInt(formData.categorie),
        })

        const response = await api.put(`/evenement/${event.id}`, {
          titre: formData.titre,
          description: formData.description,
          date: formData.date,
          horaire: formData.heure,
          lieu: formData.lieu,
          typeEvenementId: Number.parseInt(formData.categorie),
        })

        console.log("✅ Événement modifié avec succès!", response.data)

        Alert.alert("Succès", "Événement modifié avec succès !", [
          {
            text: "OK",
            onPress: () => {
              setHasChanges(false)
              onSave(event.id, formData) // Callback pour rafraîchir la liste
            },
          },
        ])
      } catch (error: any) {
        console.error("❌ Erreur modification événement:", error)

        let errorMessage = "Erreur lors de la modification de l'événement"

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response?.status === 400) {
          errorMessage = "Données invalides. Vérifiez vos informations."
        } else if (error.response?.status === 404) {
          errorMessage = "Événement non trouvé."
        } else if (error.response?.status === 500) {
          errorMessage = "Erreur serveur. Veuillez réessayer plus tard."
        } else if (error.message) {
          errorMessage = error.message
        }

        Alert.alert("Erreur", errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const updateFormData = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
    // Clear error when user starts typing
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

  const validateHeureOnBlur = () => {
    if (formData.heure) {
      const heureError = getHeureErrorMessage(formData.heure)
      if (heureError) {
        setErrors((prev) => ({ ...prev, heure: heureError }))
      }
    }
  }

  const selectedCategory = categories.find((cat) => cat.id === formData.categorie)

  return (
    <View style={styles.container}>
    

      <SafeAreaView style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier l'événement</Text>
        <View style={styles.placeholder} />
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Indicateur d'événement en cours de modification */}
        <Card style={styles.infoCard}>
          <CardContent style={styles.infoContent}>
            <View style={styles.infoHeader}>
              <View style={[styles.infoIcon, { backgroundColor: event.color }]}>
                <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Modification en cours</Text>
                <Text style={styles.infoSubtitle}>Événement : {event.titre}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

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
                maxLength={50}
              />
              {errors.titre && <Text style={styles.errorText}>{errors.titre}</Text>}
              <Text style={styles.helperText}>{formData.titre.length}/50 caractères</Text>
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
                maxLength={50}
              />
              {errors.lieu && <Text style={styles.errorText}>{errors.lieu}</Text>}
              <Text style={styles.helperText}>{formData.lieu.length}/50 caractères</Text>
            </View>

            {/* Heure de début */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Ionicons name="time-outline" size={20} color="#64748B" />
                <Text style={styles.fieldLabel}>Heure de début :</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.heure && styles.inputError]}
                value={formData.heure}
                onChangeText={(value) => updateFormData("heure", value)}
                onBlur={validateHeureOnBlur}
                placeholder="Ex: 14h30"
                placeholderTextColor="#94A3B8"
                editable={!isLoading}
              />
              {errors.heure && <Text style={styles.errorText}>{errors.heure}</Text>}
              <Text style={styles.helperText}>Format: 9h, 14h, 9h30, 14h45</Text>
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
                maxLength={50}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
              <Text style={styles.helperText}>{formData.description.length}/50 caractères</Text>
            </View>
          </CardContent>
        </Card>

        {/* Aperçu */}
        {formData.titre && selectedCategory && (
          <Card style={styles.previewCard}>
            <CardContent style={styles.previewContent}>
              <Text style={styles.previewTitle}>Aperçu des modifications</Text>
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
              { backgroundColor: selectedCategory?.color || "#007AFF" },
              (!hasChanges || isLoading) && styles.saveButtonDisabled,
            ]}
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? "Modification..." : hasChanges ? "Sauvegarder les modifications" : "Aucune modification"}
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
  infoCard: {
    marginBottom: 20,
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
    borderWidth: 1,
  },
  infoContent: {
    padding: 16,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 14,
    color: "#A16207",
  },
  formCard: {
    marginBottom: 20,
  },
  formContent: {
    padding: 20,
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
  saveButtonDisabled: {
    backgroundColor: "#94A3B8",
    opacity: 0.6,
  },
})

export default EditEventPage