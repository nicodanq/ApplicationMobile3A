"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Button } from "../../../components/button"
import { Card, CardContent } from "../../../components/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/dialog"
import { Badge } from "../../../components/badge"

import HeaderPage from "@/components/HeaderPage"
import FooterLogo from "@/components/FooterLogo"

import { Calendar, LocaleConfig } from "react-native-calendars"
import { LinearGradient } from "expo-linear-gradient"
import Animated2, { FadeInDown } from "react-native-reanimated"

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

// Données d'événements
const evenementsData: Evenement[] = [
  {
    id: "1",
    date: "2025-06-01",
    titre: "Hackathon EPF",
    heure: "10h - 17h",
    lieu: "Cachan",
    description: "Un hackathon organisé à l'EPF pour imaginer les solutions technologiques de demain.",
    categorie: "tech",
    color: "#3B82F6",
    gradientColors: ["#EBF4FF", "#DBEAFE"],
  },
  {
    id: "2",
    date: "2025-06-01",
    titre: "Forum Entreprises",
    heure: "9h - 16h",
    lieu: "Sceaux",
    description: "Rencontre entre étudiants et entreprises avec stands, entretiens et ateliers.",
    categorie: "career",
    color: "#10B981",
    gradientColors: ["#ECFDF5", "#D1FAE5"],
  },
  {
    id: "3",
    date: "2025-06-05",
    titre: "Conférence IA",
    heure: "14h - 16h",
    lieu: "Online",
    description: "Conférence sur l'impact de l'IA dans la recherche scientifique.",
    categorie: "conference",
    color: "#EC4899",
    gradientColors: ["#FDF2F8", "#FCE7F3"],
  },
  {
    id: "4",
    date: "2025-06-11",
    titre: "Workshop Design",
    heure: "10h - 17h",
    lieu: "Cachan",
    description: "Atelier pratique sur les méthodes de design thinking et prototypage.",
    categorie: "workshop",
    color: "#06B6D4",
    gradientColors: ["#F0F9FF", "#E0F7FA"],
  },
  {
    id: "5",
    date: "2025-06-11",
    titre: "Journée Portes Ouvertes",
    heure: "9h - 16h",
    lieu: "Sceaux",
    description: "Découvrez nos campus et formations lors de notre journée portes ouvertes annuelle.",
    categorie: "open",
    color: "#8B5CF6",
    gradientColors: ["#F5F3FF", "#EDE9FE"],
  },
  {
    id: "6",
    date: "2025-06-13",
    titre: "Séminaire Recherche",
    heure: "14h - 16h",
    lieu: "Online",
    description: "Présentation des derniers travaux de recherche de nos laboratoires.",
    categorie: "research",
    color: "#F59E0B",
    gradientColors: ["#FFFBEB", "#FEF3C7"],
  },
]

const AdminEventsScreen = () => {
  const [events, setEvents] = useState<Evenement[]>(evenementsData)
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showCalendar, setShowCalendar] = useState(true)

  const today = new Date().toISOString().split("T")[0]
  const upcomingEvents = events.filter((event) => event.date >= today).sort((a, b) => a.date.localeCompare(b.date))

  const evenementsFiltres = selectedDate ? events.filter((event) => event.date === selectedDate) : upcomingEvents

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
      case "tech":
        return "code-slash"
      case "career":
        return "briefcase"
      case "conference":
        return "mic"
      case "workshop":
        return "construct"
      case "open":
        return "school"
      case "research":
        return "flask"
      default:
        return "calendar"
    }
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId))
    setEventToDelete(null)
  }

  const openEventDetail = (event: Evenement) => {
    setSelectedEvent(event)
    setIsDetailModalOpen(true)
  }

  const openEditModal = (event: Evenement) => {
    setSelectedEvent(event)
    setIsEditModalOpen(true)
  }

  const confirmDelete = (eventId: string) => {
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
        selectedColor: "#003366",
        dotColor: "white",
      }
    }

    // Style pour aujourd'hui
    marked[today] = {
      ...(marked[today] || {}),
      customStyles: {
        container: {
          backgroundColor: "#E0F2FE",
          borderRadius: 20,
        },
        text: {
          color: "#003366",
          fontWeight: "bold",
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

  return (
    <View style={styles.container}>
      <HeaderPage title="Administration des Événements" />

      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Événements</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalOpen(true)}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* En-tête du calendrier avec bouton toggle */}
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarTitle}>
            {selectedDate ? formatDate(selectedDate) : "Calendrier des événements"}
          </Text>
          <TouchableOpacity style={styles.calendarToggle} onPress={toggleCalendar} activeOpacity={0.7}>
            <Text style={styles.calendarToggleText}>{showCalendar ? "Masquer" : "Afficher"}</Text>
            <Ionicons name={showCalendar ? "chevron-up" : "chevron-down"} size={16} color="#003366" />
          </TouchableOpacity>
        </View>

        {/* Calendrier */}
        {showCalendar && (
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={getMarkedDates()}
              markingType="custom"
              enableSwipeMonths={true}
              firstDay={1} // commencer lundi
              theme={{
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#003366",
                selectedDayBackgroundColor: "#003366",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#003366",
                dayTextColor: "#1E293B",
                textDisabledColor: "#94A3B8",
                dotColor: "#003366",
                selectedDotColor: "#ffffff",
                arrowColor: "#003366",
                monthTextColor: "#003366",
                textMonthFontWeight: "bold",
                textDayFontWeight: "600",
                textDayHeaderFontWeight: "600",
                textDayFontSize: 14,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              style={styles.calendar}
            />
          </View>
        )}

        <View className="mb-6">
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>
              {selectedDate
                ? `Événements du ${formatDate(selectedDate).split(" ").slice(0, 2).join(" ")}`
                : `Prochains événements (${evenementsFiltres.length})`}
            </Text>
            {selectedDate && (
              <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Tout voir</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {evenementsFiltres.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="calendar-outline" size={64} color="#94A3B8" />
                </View>
                <Text style={styles.emptyText}>Aucun événement {selectedDate ? "ce jour-là" : "à venir"}.</Text>
              </View>
            </CardContent>
          </Card>
        ) : (
          evenementsFiltres.map((event, index) => (
            <Animated2.View key={event.id} entering={FadeInDown.delay(index * 100).springify()}>
              <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8} onPress={() => openEventDetail(event)}>
                <LinearGradient
                  colors={event.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.imageContainer}>
                      <View style={[styles.iconContainer, { backgroundColor: event.color }]}>
                        <Ionicons name={getCategoryIcon(event.categorie)} size={24} color="white" />
                      </View>
                      <View style={styles.imageOverlay} />
                    </View>

                    <View style={styles.textContainer}>
                      <View style={styles.cardHeaderContent}>
                        <Text style={[styles.cardTitle, { color: event.color }]}>{event.titre}</Text>
                        <View style={styles.cardActions}>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={(e) => {
                              e.stopPropagation()
                              openEditModal(event)
                            }}
                          >
                            <Ionicons name="create-outline" size={20} color="#3B82F6" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={(e) => {
                              e.stopPropagation()
                              confirmDelete(event.id)
                            }}
                          >
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <Text style={styles.cardDescription} numberOfLines={2}>
                        {event.description}
                      </Text>

                      <View style={styles.eventDetails}>
                        <View style={styles.eventDetailItem}>
                          <Ionicons name="calendar-outline" size={14} color="#64748B" />
                          <Text style={styles.eventDetailText}>
                            {formatDate(event.date).split(" ").slice(0, 2).join(" ")}
                          </Text>
                        </View>
                        <View style={styles.eventDetailItem}>
                          <Ionicons name="time-outline" size={14} color="#64748B" />
                          <Text style={styles.eventDetailText}>{event.heure}</Text>
                        </View>
                        <View style={styles.eventDetailItem}>
                          <Ionicons name="location-outline" size={14} color="#64748B" />
                          <Text style={styles.eventDetailText}>{event.lieu}</Text>
                        </View>
                      </View>

                      <View style={styles.learnMoreButton}>
                        <Text style={[styles.learnMoreText, { color: event.color }]}>Voir les détails</Text>
                        <Ionicons name="arrow-forward" size={16} color={event.color} style={styles.arrowIcon} />
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated2.View>
          ))
        )}

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
                    <Ionicons name="time-outline" size={18} color="#64748B" style={styles.modalDetailIcon} />
                    <Text style={styles.modalDetailText}>{selectedEvent.heure}</Text>
                  </View>

                  <View style={styles.modalDetailItem}>
                    <Ionicons name="location-outline" size={18} color="#64748B" style={styles.modalDetailIcon} />
                    <Text style={styles.modalDetailText}>{selectedEvent.lieu}</Text>
                  </View>
                </View>

                <View style={styles.modalDetailItem}>
                  <Ionicons name="calendar-outline" size={18} color="#64748B" style={styles.modalDetailIcon} />
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

      {/* Modal d'ajout d'événement */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel événement</DialogTitle>
            <DialogDescription>
              Fonctionnalité en cours de développement. Le formulaire d'ajout sera disponible prochainement.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onPress={() => setIsAddModalOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de modification */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'événement</DialogTitle>
            <DialogDescription>
              Fonctionnalité en cours de développement. Le formulaire de modification sera disponible prochainement.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <View style={styles.editModalContent}>
              <Text style={styles.editModalText}>
                Événement sélectionné : <Text style={styles.editModalEventName}>{selectedEvent.titre}</Text>
              </Text>
            </View>
          )}
          <DialogFooter>
            <Button variant="outline" onPress={() => setIsEditModalOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'événement</DialogTitle>
            <DialogDescription>
              {eventToDelete && (
                <Text>Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.</Text>
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
                  handleDeleteEvent(eventToDelete)
                  setIsDeleteModalOpen(false)
                }
              }}
              style={{ backgroundColor: "#EF4444" }}
            >
              Supprimer
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
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
  },
  addButton: {
    backgroundColor: "#3B82F6",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  calendarToggle: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  calendarToggleText: {
    color: "#003366",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 4,
  },
  calendarContainer: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  calendar: {
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  resetButton: {
    padding: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
  },
  resetButtonText: {
    color: "#003366",
    fontSize: 12,
    fontWeight: "600",
  },
  cardContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardContent: {
    flexDirection: "row",
    padding: 20,
    minHeight: 140,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
    position: "relative",
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: "#F1F5F9",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    marginRight: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 12,
    lineHeight: 20,
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  eventDetailText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 8,
  },
  learnMoreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
  arrowIcon: {
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
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
    backgroundColor: "#F8FAFC",
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
    color: "#1E293B",
  },
  modalDescriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1E293B",
  },
  modalDescription: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
  },
  editModalContent: {
    paddingVertical: 16,
  },
  editModalText: {
    fontSize: 14,
    color: "#64748B",
  },
  editModalEventName: {
    fontWeight: "600",
    color: "#1E293B",
  },
})

export default AdminEventsScreen
