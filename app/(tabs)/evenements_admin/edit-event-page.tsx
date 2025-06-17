"use client"

import { useState, useCallback, useEffect } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { BackHandler } from "react-native"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Button } from "../../../components/button"
import { Card, CardContent } from "../../../components/card"

import HeaderPage from "@/components/HeaderPage"
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

const categories = [
  { id: "tech", label: "Technologie", color: "#3B82F6", icon: "code-slash" },
  { id: "career", label: "Carrière", color: "#10B981", icon: "briefcase" },
  { id: "conference", label: "Conférence", color: "#EC4899", icon: "mic" },
  { id: "workshop", label: "Atelier", color: "#06B6D4", icon: "construct" },
  { id: "open", label: "Portes ouvertes", color: "#8B5CF6", icon: "school" },
  { id: "research", label: "Recherche", color: "#F59E0B", icon: "flask" },
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

  // Pré-remplir le formulaire avec les données de l'événement
  useEffect(() => {
    if (event) {
      setFormData({
        titre: event.titre,
        categorie: event.categorie || "",
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
          // Ici on pourrait ajouter une confirmation de sortie
          // Pour l'instant, on sort directement
        }
        onBack()
        return true // Empêche le comportement par défaut
      }

      const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress)

      return () => backHandler.remove()
    }, [onBack, hasChanges]),
  )

  const validateForm = () => {
    const newErrors: Partial<EventFormData> = {}

    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est requis"
    }
    if (!formData.categorie) {
      newErrors.categorie = "La catégorie est requise"
    }
    if (!formData.date.trim()) {
      newErrors.date = "La date est requise"
    }
    if (!formData.lieu.trim()) {
      newErrors.lieu = "Le lieu est requis"
    }
    if (!formData.heure.trim()) {
      newErrors.heure = "L'horaire est requis"
    }
    if (!formData.description.trim()) {
      newErrors.description = "La description est requise"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(event.id, formData)
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

  const selectedCategory = categories.find((cat) => cat.id === formData.categorie)

  return (
    <View style={styles.container}>
      <HeaderPage title="Modification d'un événement" />

      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier l'événement</Text>
        <View style={styles.placeholder} />
      </View>

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
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
              />
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
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
              />
              {errors.heure && <Text style={styles.errorText}>{errors.heure}</Text>}
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
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
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
          <Button variant="outline" onPress={onBack} style={styles.cancelButton} textStyle={styles.cancelButtonText}>
            Annuler
          </Button>
          <Button
            onPress={handleSave}
            style={[
              styles.saveButton,
              { backgroundColor: selectedCategory?.color || "#3B82F6" },
              !hasChanges && styles.saveButtonDisabled,
            ]}
            disabled={!hasChanges}
          >
            {hasChanges ? "Sauvegarder les modifications" : "Aucune modification"}
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
