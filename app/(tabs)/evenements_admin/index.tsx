"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, BackHandler, Alert } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { Button } from "../../../components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/dialog"
import { Badge } from "../../../components/badge"
import FooterLogo from "@/components/FooterLogo"
import CreateEventPage from "./create-event-page"
import EditEventPage from "./edit-event-page"
import { SafeAreaView } from "react-native"

import { Calendar, LocaleConfig } from "react-native-calendars"
import Animated2, { FadeInDown } from "react-native-reanimated"

import api from "@/api/axiosClient"

//calendrier en francais
LocaleConfig.locales["fr"] = {
  monthNames: [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ],
  monthNamesShort: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
  dayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  dayNamesShort: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
}

LocaleConfig.defaultLocale = "fr"

// Fonction pour convertir "14:30:00" en "14h30"
const convertTimeToHeure = (timeString: string): string => {
  const parts = timeString.split(":")
  const heures = Number.parseInt(parts[0], 10)
  const minutes = Number.parseInt(parts[1], 10)

  if (minutes === 0) {
    return `${heures}h`
  } else {
    return `${heures}h${minutes.toString().padStart(2, "0")}`
  }
}

// Types
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

type EventFormData = {
  titre: string
  categorie: string
  date: string
  lieu: string
  heure: string
  description: string
}

const categoryColors: { [key: string]: { color: string; gradientColors: [string, string] } } = {
  formation: { color: "#007AFF", gradientColors: ["#EBF4FF", "#DBEAFE"] },
  afterwork: { color: "#34C759", gradientColors: ["#ECFDF5", "#D1FAE5"] },
  forum: { color: "#FF2D92", gradientColors: ["#FDF2F8", "#FCE7F3"] },
}

const AdminEventsScreen = () => {
  const [events, setEvents] = useState<Evenement[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  const [showCreatePage, setShowCreatePage] = useState(false)
  const [showEditPage, setShowEditPage] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<Evenement | null>(null)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showCalendar, setShowCalendar] = useState(true)

  const today = new Date().toISOString().split("T")[0]
  const upcomingEvents = events.filter((event) => event.date >= today).sort((a, b) => a.date.localeCompare(b.date))

  const evenementsFiltres = selectedDate ? events.filter((event) => event.date === selectedDate) : upcomingEvents

  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        const response = await api.get("/evenement/")
        const data = response.data

        console.log("✅ Données reçues (Admin) :", data)

        // Formatage des événements (adapter en fonction des noms SQL)
        const mappedEvents = data.map((event: any) => ({
          id: event.Id_Event.toString(),
          titre: event.titre_Event,
          description: event.description_Event,
          date: event.date_Event.split("T")[0],
          heure: convertTimeToHeure(event.horaire_Event), // Conversion TIME -> format lisible
          lieu: event.lieu_Event,
          categorie: getCategorie(event.ID_typeEvenement),
          color: getColor(event.ID_typeEvenement, event.description_Event),
          gradientColors: getGradient(event.ID_typeEvenement, event.description_Event),
        }))

        setEvents(mappedEvents)
      } catch (error) {
        console.error("Erreur récupération événements (Admin) :", error)
        Alert.alert("Erreur", "Erreur lors du chargement des événements")
      }
    }

    fetchEvenements()
  }, [])

  const getCategorie = (typeId: number): string => {
    switch (typeId) {
      case 1:
        return "formation"
      case 2:
        return "afterwork"
      case 3:
        return "forum"
      default:
        return "default"
    }
  }

  const getColor = (typeId: number, description: string): string => {
    // Si l'événement est annulé, toujours rouge
    if (description.includes("ANNULÉ")) {
      return "#FF3B30"
    }

    switch (typeId) {
      case 1:
        return "#007AFF"
      case 2:
        return "#34C759"
      case 3:
        return "#FF2D92"
      default:
        return "#8E8E93"
    }
  }

  const getGradient = (typeId: number, description: string): [string, string] => {
    // Si l'événement est annulé, toujours rouge
    if (description.includes("ANNULÉ")) {
      return ["#FFEBEE", "#FFCDD2"]
    }

    switch (typeId) {
      case 1:
        return ["#EBF4FF", "#DBEAFE"]
      case 2:
        return ["#ECFDF5", "#D1FAE5"]
      case 3:
        return ["#FDF2F8", "#FCE7F3"]
      default:
        return ["#F1F5F9", "#E2E8F0"]
    }
  }

  // Gestion du bouton retour du téléphone
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (showCreatePage) {
          setShowCreatePage(false)
          return true // Empêche le comportement par défaut
        }
        if (showEditPage) {
          setShowEditPage(false)
          setEventToEdit(null)
          return true // Empêche le comportement par défaut
        }
        return false // Laisse le comportement par défaut
      }

      const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress)

      return () => backHandler.remove()
    }, [showCreatePage, showEditPage]),
  )

  // Rafraîchir les événements quand on revient sur la page
  useFocusEffect(
    useCallback(() => {
      if (!showCreatePage && !showEditPage) {
        refreshEvents()
      }
    }, [showCreatePage, showEditPage]),
  )

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
    return date.toLocaleDateString("fr-FR", options)
  }

  // Obtenir l'icône selon la catégorie
  const getCategoryIcon = (categorie?: string) => {
    switch (categorie) {
      case "formation":
        return "school"
      case "afterwork":
        return "wine"
      case "forum":
        return "people"
      default:
        return "calendar"
    }
  }

  const refreshEvents = async () => {
    try {
      const response = await api.get("/evenement/")
      const data = response.data

      const mappedEvents = data.map((event: any) => ({
        id: event.Id_Event.toString(),
        titre: event.titre_Event,
        description: event.description_Event,
        date: event.date_Event.split("T")[0],
        heure: convertTimeToHeure(event.horaire_Event), // Conversion TIME -> format lisible
        lieu: event.lieu_Event,
        categorie: getCategorie(event.ID_typeEvenement),
        color: getColor(event.ID_typeEvenement, event.description_Event),
        gradientColors: getGradient(event.ID_typeEvenement, event.description_Event),
      }))

      setEvents(mappedEvents)
    } catch (error) {
      console.error("Erreur rafraîchissement événements :", error)
    }
  }

  const handleCreateEvent = async (eventData: EventFormData) => {
    // Rafraîchir les données depuis la base
    await refreshEvents()
    setShowCreatePage(false)
    Alert.alert("Succès", "Événement créé avec succès")
  }

  const handleEditEvent = async (eventId: string, eventData: EventFormData) => {
    // Rafraîchir les données depuis la base après modification
    await refreshEvents()
    setShowEditPage(false)
    setEventToEdit(null)
    Alert.alert("Succès", "Événement modifié avec succès")
  }

  const openEventDetail = (event: Evenement) => {
    setSelectedEvent(event)
    setIsDetailModalOpen(true)
  }

  const openEditPage = (event: Evenement) => {
    setEventToEdit(event)
    setShowEditPage(true)
  }

  const confirmCancel = (eventId: string) => {
    setEventToDelete(eventId)
    setIsDeleteModalOpen(true)
  }

  const getMarkedDates = () => {
    const marked: { [date: string]: any } = {}
    events.forEach((event) => {
      marked[event.date] = {
        ...(marked[event.date] || {}),
        marked: true,
        dotColor: event.color,
      }
    })
    if (selectedDate) {
      marked[selectedDate] = {
        ...(marked[selectedDate] || {}),
        selected: true,
        selectedColor: "#007AFF",
        dotColor: "white",
      }
    }

    marked[today] = {
      ...(marked[today] || {}),
      customStyles: {
        container: {
          backgroundColor: "#E3F2FD",
          borderRadius: 16,
        },
        text: {
          color: "#007AFF",
          fontWeight: "600",
        },
      },
    }

    return marked
  }

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(selectedDate === day.dateString ? null : day.dateString)
  }

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar)
  }

  const handleCancelEvent = async (eventId: string) => {
    try {
      const eventToCancel = events.find((e) => e.id === eventId)
      const isAlreadyCancelled = eventToCancel?.description.includes("ANNULÉ")

      if (isAlreadyCancelled) {
        // Réactiver l'événement
        await api.put(`/evenement/reactiver/${eventId}`)
        await refreshEvents()
        Alert.alert("Succès", "Événement réactivé avec succès")
      } else {
        // Annuler l'événement
        await api.put(`/evenement/annuler/${eventId}`)
        await refreshEvents()
        Alert.alert("Succès", "Événement annulé avec succès")
      }

      setEventToDelete(null)
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Erreur annulation/réactivation événement :", error)
      Alert.alert("Erreur", "Erreur lors de l'opération")
    }
  }

  // Si on est sur la page de création, afficher cette page
  if (showCreatePage) {
    return <CreateEventPage onBack={() => setShowCreatePage(false)} onSave={handleCreateEvent} />
  }

  // Si on est sur la page de modification, afficher cette page
  if (showEditPage && eventToEdit) {
    return (
      <EditEventPage
        event={eventToEdit}
        onBack={() => {
          setShowEditPage(false)
          setEventToEdit(null)
        }}
        onSave={handleEditEvent}
      />
    )
  }

  return (
    <View style={styles.container}>
      {/* Header avec bouton intégré */}
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Événements</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowCreatePage(true)} activeOpacity={0.7}>
            <Ionicons name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerLine} />
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Section Calendrier */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader} onPress={toggleCalendar} activeOpacity={0.7}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={20} color="#007AFF" />
              </View>
              <Text style={styles.sectionTitle}>Calendrier</Text>
            </View>
            <Ionicons name={showCalendar ? "chevron-up" : "chevron-down"} size={20} color="#8E8E93" />
          </TouchableOpacity>

          {showCalendar && (
            <View style={styles.calendarCard}>
              <Calendar
                onDayPress={handleDayPress}
                markedDates={getMarkedDates()}
                markingType="custom"
                enableSwipeMonths={true}
                firstDay={1}
                theme={{
                  calendarBackground: "#FFFFFF",
                  textSectionTitleColor: "#1D1D1F",
                  selectedDayBackgroundColor: "#007AFF",
                  selectedDayTextColor: "#FFFFFF",
                  todayTextColor: "#007AFF",
                  dayTextColor: "#1D1D1F",
                  textDisabledColor: "#C7C7CC",
                  dotColor: "#007AFF",
                  selectedDotColor: "#FFFFFF",
                  arrowColor: "#007AFF",
                  monthTextColor: "#1D1D1F",
                  textMonthFontWeight: "600",
                  textDayFontWeight: "400",
                  textDayHeaderFontWeight: "600",
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
                style={styles.calendar}
              />
            </View>
          )}
        </View>

        {/* Section Événements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="settings" size={20} color="#34C759" />
              </View>
              <Text style={styles.sectionTitle}>
                {selectedDate
                  ? `Événements du ${formatDate(selectedDate).split(" ").slice(0, 2).join(" ")}`
                  : `Gestion des événements (${evenementsFiltres.length})`}
              </Text>
            </View>
            {selectedDate && (
              <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Tout voir</Text>
              </TouchableOpacity>
            )}
          </View>

          {evenementsFiltres.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="calendar-outline" size={48} color="#C7C7CC" />
              </View>
              <Text style={styles.emptyText}>Aucun événement {selectedDate ? "ce jour-là" : "à venir"}</Text>
            </View>
          ) : (
            evenementsFiltres.map((event, index) => (
              <Animated2.View key={event.id} entering={FadeInDown.delay(index * 100).springify()}>
                <TouchableOpacity style={styles.eventCard} activeOpacity={0.8} onPress={() => openEventDetail(event)}>
                  <View style={styles.eventHeader}>
                    <View style={[styles.eventIconContainer, { backgroundColor: event.color }]}>
                      <Ionicons name={getCategoryIcon(event.categorie)} size={20} color="white" />
                    </View>
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle}>{event.titre}</Text>
                      <Text style={styles.eventSubtitle}>{event.description}</Text>
                    </View>
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                          e.stopPropagation()
                          openEditPage(event)
                        }}
                      >
                        <Ionicons name="create-outline" size={18} color="#007AFF" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={(e) => {
                          e.stopPropagation()
                          confirmCancel(event.id)
                        }}
                      >
                        <Ionicons
                          name={event.description.includes("ANNULÉ") ? "refresh-outline" : "close-outline"}
                          size={18}
                          color="#FF3B30"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetailItem}>
                      <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
                      <Text style={styles.eventDetailText}>
                        {formatDate(event.date).split(" ").slice(0, 2).join(" ")}
                      </Text>
                    </View>
                    <View style={styles.eventDetailItem}>
                      <Ionicons name="time-outline" size={16} color="#8E8E93" />
                      <Text style={styles.eventDetailText}>{event.heure}</Text>
                    </View>
                    <View style={styles.eventDetailItem}>
                      <Ionicons name="location-outline" size={16} color="#8E8E93" />
                      <Text style={styles.eventDetailText}>{event.lieu}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated2.View>
            ))
          )}
        </View>

        <FooterLogo />
      </ScrollView>

      {/* Modal de détails de l'événement */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent>
          {selectedEvent && (
            <>
              <DialogHeader>
                <View style={styles.modalHeader}>
                  <View style={[styles.modalIconContainer, { backgroundColor: selectedEvent.color }]}>
                    <Ionicons name={getCategoryIcon(selectedEvent.categorie)} size={32} color="white" />
                  </View>
                  <DialogTitle>{selectedEvent.titre}</DialogTitle>
                  <Badge
                    style={{ backgroundColor: `${selectedEvent.color}20` }}
                    textStyle={{ color: selectedEvent.color }}
                  >
                    {selectedEvent.categorie}
                  </Badge>
                </View>
              </DialogHeader>

              <View style={styles.modalDetailsContainer}>
                <View style={styles.modalDetailRow}>
                  <View style={styles.modalDetailItem}>
                    <Ionicons name="time-outline" size={18} color="#8E8E93" style={styles.modalDetailIcon} />
                    <Text style={styles.modalDetailText}>{selectedEvent.heure}</Text>
                  </View>

                  <View style={styles.modalDetailItem}>
                    <Ionicons name="location-outline" size={18} color="#8E8E93" style={styles.modalDetailIcon} />
                    <Text style={styles.modalDetailText}>{selectedEvent.lieu}</Text>
                  </View>
                </View>

                <View style={styles.modalDetailItem}>
                  <Ionicons name="calendar-outline" size={18} color="#8E8E93" style={styles.modalDetailIcon} />
                  <Text style={styles.modalDetailText}>{formatDate(selectedEvent.date)}</Text>
                </View>
              </View>

              <Text style={styles.modalDescriptionTitle}>Description</Text>
              <Text style={styles.modalDescription}>{selectedEvent.description}</Text>

              <DialogFooter>
                <Button variant="outline" onPress={() => setIsDetailModalOpen(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {events.find((e) => e.id === eventToDelete)?.description.includes("ANNULÉ")
                ? "Réactiver l'événement"
                : "Annuler l'événement"}
            </DialogTitle>
            <DialogDescription>
              {eventToDelete && (
                <Text>
                  {events.find((e) => e.id === eventToDelete)?.description.includes("ANNULÉ")
                    ? "Êtes-vous sûr de vouloir réactiver cet événement ?"
                    : "Êtes-vous sûr de vouloir annuler cet événement ? Il sera marqué comme annulé."}
                </Text>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onPress={() => setIsDeleteModalOpen(false)} style={{ marginRight: 8 }}>
              Annuler
            </Button>
            <Button
              onPress={() => {
                if (eventToDelete) {
                  handleCancelEvent(eventToDelete)
                }
              }}
              style={{ backgroundColor: "#FF3B30" }}
            >
              {events.find((e) => e.id === eventToDelete)?.description.includes("ANNULÉ")
                ? "Réactiver"
                : "Annuler l'événement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerContainer: {
    paddingTop: 28, // ou utilisez useSafeAreaInsets si vous préférez
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#F8FAFC",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E293B",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  headerLine: {
    height: 2,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 40,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: "auto",
    marginRight: 20,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#E3F2FD",
    borderRadius: 16,
  },
  resetButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  calendarCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  calendar: {
    borderRadius: 16,
    paddingVertical: 16,
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 2,
  },
  eventSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#FFEBEE",
  },
  deleteButton: {
    backgroundColor: "#FFEBEE",
  },
  eventDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  eventDetailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventDetailText: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 6,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalDetailsContainer: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  modalDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  modalDetailIcon: {
    marginRight: 8,
  },
  modalDetailText: {
    fontSize: 14,
    color: "#1D1D1F",
  },
  modalDescriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1D1D1F",
  },
  modalDescription: {
    fontSize: 15,
    color: "#8E8E93",
    lineHeight: 22,
  },
})

export default AdminEventsScreen
