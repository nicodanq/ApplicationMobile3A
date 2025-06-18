"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, BackHandler } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
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
import CreateEventPage from "./create-event-page"
import EditEventPage from "./edit-event-page"

import { Calendar, LocaleConfig } from "react-native-calendars"
import { LinearGradient } from "expo-linear-gradient"
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

// Types corrigés
type Evenement = {
  id: string
  date: string
  titre: string
  heureDebut: string // Changé de 'heure' vers 'heureDebut'
  heureFin: string // Ajouté 'heureFin'
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
  heureDebut: string
  heureFin: string
  description: string
}

const categoryColors: { [key: string]: { color: string; gradientColors: [string, string] } } = {
  tech: { color: "#3B82F6", gradientColors: ["#EBF4FF", "#DBEAFE"] },
  career: { color: "#10B981", gradientColors: ["#ECFDF5", "#D1FAE5"] },
  conference: { color: "#EC4899", gradientColors: ["#FDF2F8", "#FCE7F3"] },
  workshop: { color: "#06B6D4", gradientColors: ["#F0F9FF", "#E0F7FA"] },
  open: { color: "#8B5CF6", gradientColors: ["#F5F3FF", "#EDE9FE"] },
  research: { color: "#F59E0B", gradientColors: ["#FFFBEB", "#FEF3C7"] },
}

const AdminEventsScreen = () => {
  const [events, setEvents] = useState<Evenement[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
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
          heureDebut: event.horaire_debut,
          heureFin: event.horaire_fin,
          lieu: event.lieu_Event,
          categorie: getCategorie(event.ID_typeEvenement),
          color: getColor(event.ID_typeEvenement),
          gradientColors: getGradient(event.ID_typeEvenement),
        }))

        setEvents(mappedEvents)
      } catch (error) {
        console.error("Erreur récupération événements (Admin) :", error)
      }
    }

    fetchEvenements()
  }, [])

  const getCategorie = (typeId: number): string => {
    switch (typeId) {
      case 1:
        return "tech"
      case 2:
        return "career"
      case 3:
        return "conference"
      case 4:
        return "workshop"
      case 5:
        return "open"
      case 6:
        return "research"
      default:
        return "default"
    }
  }

  const getColor = (typeId: number): string => {
    switch (typeId) {
      case 1:
        return "#3B82F6"
      case 2:
        return "#10B981"
      case 3:
        return "#EC4899"
      case 4:
        return "#06B6D4"
      case 5:
        return "#8B5CF6"
      case 6:
        return "#F59E0B"
      default:
        return "#64748B"
    }
  }

  const getGradient = (typeId: number): [string, string] => {
    switch (typeId) {
      case 1:
        return ["#EBF4FF", "#DBEAFE"]
      case 2:
        return ["#ECFDF5", "#D1FAE5"]
      case 3:
        return ["#FDF2F8", "#FCE7F3"]
      case 4:
        return ["#F0F9FF", "#E0F7FA"]
      case 5:
        return ["#F5F3FF", "#EDE9FE"]
      case 6:
        return ["#FFFBEB", "#FEF3C7"]
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

  const refreshEvents = async () => {
    try {
      const response = await api.get("/evenement/")
      const data = response.data

      const mappedEvents = data.map((event: any) => ({
        id: event.Id_Event.toString(),
        titre: event.titre_Event,
        description: event.description_Event,
        date: event.date_Event.split("T")[0],
        heureDebut: event.horaire_debut,
        heureFin: event.horaire_fin,
        lieu: event.lieu_Event,
        categorie: getCategorie(event.ID_typeEvenement),
        color: getColor(event.ID_typeEvenement),
        gradientColors: getGradient(event.ID_typeEvenement),
      }))

      setEvents(mappedEvents)
    } catch (error) {
      console.error("Erreur rafraîchissement événements :", error)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await api.delete(`/evenement/${eventId}`)
      await refreshEvents() // Rafraîchir la liste après suppression
      setEventToDelete(null)
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Erreur suppression événement :", error)
      // Optionnel : afficher un message d'erreur à l'utilisateur
    }
  }

  const handleCreateEvent = async (eventData: EventFormData) => {
    // Logique de création via API (à implémenter selon votre backend)
    // await api.post("/evenement/", eventData);

    // Pour l'instant, on garde la logique locale et on rafraîchit
    const categoryStyle = categoryColors[eventData.categorie] || categoryColors.tech
    const newEvent: Evenement = {
      id: Date.now().toString(),
      titre: eventData.titre,
      categorie: eventData.categorie,
      date: eventData.date,
      lieu: eventData.lieu,
      heureDebut: eventData.heureDebut,
      heureFin: eventData.heureFin,
      description: eventData.description,
      color: categoryStyle.color,
      gradientColors: categoryStyle.gradientColors,
    }
    setEvents([...events, newEvent])
    setShowCreatePage(false)

    // Optionnel : rafraîchir depuis la base après création
    // await refreshEvents();
  }

  const handleEditEvent = async (eventId: string, eventData: EventFormData) => {
    // Logique de modification via API (à implémenter selon votre backend)
    // await api.put(`/evenement/${eventId}`, eventData);

    // Pour l'instant, on garde la logique locale
    const categoryStyle = categoryColors[eventData.categorie] || categoryColors.tech
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              titre: eventData.titre,
              categorie: eventData.categorie,
              date: eventData.date,
              lieu: eventData.lieu,
              heureDebut: eventData.heureDebut,
              heureFin: eventData.heureFin,
              description: eventData.description,
              color: categoryStyle.color,
              gradientColors: categoryStyle.gradientColors,
            }
          : event,
      ),
    )
    setShowEditPage(false)
    setEventToEdit(null)

    // Optionnel : rafraîchir depuis la base après modification
    // await refreshEvents();
  }

  const openEventDetail = (event: Evenement) => {
    setSelectedEvent(event)
    setIsDetailModalOpen(true)
  }

  const openEditPage = (event: Evenement) => {
    setEventToEdit(event)
    setShowEditPage(true)
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
      {/* Header */}
      <View style={styles.header}>
        <HeaderPage title="Administration des Événements" />
        <TouchableOpacity style={styles.addButton} onPress={() => setShowCreatePage(true)} activeOpacity={0.7}>
          <Ionicons name="add" size={24} color="#000000" />
        </TouchableOpacity>
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
                              openEditPage(event)
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
                          <Text style={styles.eventDetailText}>
                            {event.heureDebut} - {event.heureFin}
                          </Text>
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
                    <Text style={styles.eventDetailText}>
                      {selectedEvent.heureDebut} - {selectedEvent.heureFin}
                    </Text>
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
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  addButton: {
    backgroundColor: "#F1F5F9",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
})

export default AdminEventsScreen
