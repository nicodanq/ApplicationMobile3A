"use client"

import { useSession } from "@/contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useRef, useState } from "react"
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Calendar, LocaleConfig } from "react-native-calendars"
import Animated2, { FadeInDown } from "react-native-reanimated"

import FooterLogo from "@/components/FooterLogo"
import HeaderPage from "@/components/HeaderPage"
import api from "@/api/axiosClient"

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

type Evenement = {
  id: string
  date: string
  titre: string
  heure: string
  lieu: string
  description: string
  categorie?: string
  color: string
}

const EvenementsScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null)
  const [showCalendar, setShowCalendar] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)
  const { user } = useSession()

  const fadeAnim = useRef(new Animated.Value(1)).current
  const scrollViewRef = useRef<ScrollView>(null)
  const today = new Date().toISOString().split("T")[0]

  const [evenements, setEvenements] = useState<Evenement[]>([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    const fetchEvenements = async () => {
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
          color: getColor(event.ID_typeEvenement),
        }))

        setEvenements(mappedEvents)
      } catch (error) {
        console.error("Erreur récupération événements :", error)
        Alert.alert("Erreur", "Erreur lors du chargement des événements")
      } finally {
        setLoading(false)
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

  const getColor = (typeId: number): string => {
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

  const handleInscription = async () => {
    if (!selectedEvent || !user?.id) {
      Alert.alert("Erreur", "Vous devez être connecté pour vous inscrire")
      return
    }

    setIsRegistering(true)

    try {
      const response = await api.post("/evenement/inscrire", {
        ID_user: user.id,
        Id_Event: selectedEvent.id,
      })

      if (response.data.success) {
        setModalVisible(false)
        setTimeout(() => {
          Alert.alert("Succès", "Inscription réussie !", [{ text: "OK" }])
        }, 300)
      }
    } catch (error: any) {
      let errorMessage = "Erreur lors de l'inscription"

      if (error.response?.status === 409) {
        errorMessage = "Vous êtes déjà inscrit à cet événement"
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      Alert.alert("Information", errorMessage)
    } finally {
      setIsRegistering(false)
    }
  }

  const evenementsFiltres = selectedDate
    ? evenements.filter((event) => event.date === selectedDate)
    : evenements.filter((event) => event.date >= today).sort((a, b) => a.date.localeCompare(b.date))

  const getMarkedDates = () => {
    const marked: { [date: string]: any } = {}
    evenements.forEach((event) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
    return date.toLocaleDateString("fr-FR", options)
  }

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

  useEffect(() => {
    fadeAnim.setValue(0)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [selectedDate])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <HeaderPage title="Événements" />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
                <Ionicons name="calendar-outline" size={20} color="#34C759" />
              </View>
              <Text style={styles.sectionTitle}>
                {selectedDate
                  ? `Événements du ${formatDate(selectedDate).split(" ").slice(0, 2).join(" ")}`
                  : "Prochains événements"}
              </Text>
            </View>
            {selectedDate && (
              <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Tout voir</Text>
              </TouchableOpacity>
            )}
          </View>

          <Animated.View style={{ opacity: fadeAnim }}>
            {evenementsFiltres.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="calendar-outline" size={48} color="#C7C7CC" />
                </View>
                <Text style={styles.emptyText}>Aucun événement {selectedDate ? "ce jour-là" : "à venir"}</Text>
              </View>
            ) : (
              evenementsFiltres.map((item, index) => (
                <Animated2.View key={item.id} entering={FadeInDown.delay(index * 100).springify()}>
                  <TouchableOpacity
                    style={styles.eventCard}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedEvent(item)
                      setModalVisible(true)
                    }}
                  >
                    <View style={styles.eventHeader}>
                      <View style={[styles.eventIconContainer, { backgroundColor: item.color }]}>
                        <Ionicons name={getCategoryIcon(item.categorie)} size={20} color="white" />
                      </View>
                      <View style={styles.eventInfo}>
                        <Text style={styles.eventTitle}>{item.titre}</Text>
                        <Text style={styles.eventSubtitle}>{item.description}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                    </View>

                    <View style={styles.eventDetails}>
                      <View style={styles.eventDetailItem}>
                        <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
                        <Text style={styles.eventDetailText}>
                          {formatDate(item.date).split(" ").slice(0, 2).join(" ")}
                        </Text>
                      </View>
                      <View style={styles.eventDetailItem}>
                        <Ionicons name="time-outline" size={16} color="#8E8E93" />
                        <Text style={styles.eventDetailText}>{item.heure}</Text>
                      </View>
                      <View style={styles.eventDetailItem}>
                        <Ionicons name="location-outline" size={16} color="#8E8E93" />
                        <Text style={styles.eventDetailText}>{item.lieu}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated2.View>
              ))
            )}
          </Animated.View>
        </View>

        <FooterLogo />
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {selectedEvent && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.modalIconContainer, { backgroundColor: selectedEvent.color }]}>
                    <Ionicons name={getCategoryIcon(selectedEvent.categorie)} size={28} color="white" />
                  </View>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#8E8E93" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.modalTitle}>{selectedEvent.titre}</Text>

                  <View style={styles.modalDetailsCard}>
                    <View style={styles.modalDetailRow}>
                      <View style={styles.modalDetailItem}>
                        <Ionicons name="time-outline" size={18} color="#8E8E93" />
                        <Text style={styles.modalDetailText}>{selectedEvent.heure}</Text>
                      </View>
                      <View style={styles.modalDetailItem}>
                        <Ionicons name="location-outline" size={18} color="#8E8E93" />
                        <Text style={styles.modalDetailText}>{selectedEvent.lieu}</Text>
                      </View>
                    </View>
                    <View style={styles.modalDetailItem}>
                      <Ionicons name="calendar-outline" size={18} color="#8E8E93" />
                      <Text style={styles.modalDetailText}>{formatDate(selectedEvent.date)}</Text>
                    </View>
                  </View>

                  <View style={styles.descriptionSection}>
                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>{selectedEvent.description}</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.inscriptionButton, { opacity: isRegistering ? 0.6 : 1 }]}
                    onPress={handleInscription}
                    activeOpacity={0.8}
                    disabled={isRegistering}
                  >
                    <Text style={styles.inscriptionButtonText}>{isRegistering ? "Inscription..." : "S'inscrire"}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 0, // Assure-toi que le padding top est à 0
  },
  scrollView: {
    flex: 1,
    marginTop: 0, // Supprime toute marge top
  },
  scrollContent: {
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  modalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 20,
    textAlign: "center",
  },
  modalDetailsCard: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  modalDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalDetailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalDetailText: {
    fontSize: 16,
    color: "#1D1D1F",
    marginLeft: 8,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#8E8E93",
    lineHeight: 22,
  },
  inscriptionButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  inscriptionButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
})

export default EvenementsScreen
