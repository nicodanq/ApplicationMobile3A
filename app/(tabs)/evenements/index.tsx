"use client"

import { useSession } from "@/contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useRef, useState } from "react"
import {
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

import MiniBar from "@/components/MiniPopUp"

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

// const user = {
//   id: "12345",
//   nom: "Federico",
//   email: "fede@mail.com",
// }

// Données d'événements avec styles harmonisés avec l'écran d'études
// const evenementsData: Evenement[] = [
//   {
//     id: "1",
//     date: "2025-06-01",
//     titre: "Hackathon EPF",
//     heure: "10h - 17h",
//     lieu: "Cachan",
//     description: "Un hackathon organisé à l'EPF pour imaginer les solutions technologiques de demain.",
//     categorie: "tech",
//     color: "#3B82F6", // Bleu comme IT & Digital
//     gradientColors: ["#EBF4FF", "#DBEAFE"],
//   },
//   {
//     id: "2",
//     date: "2025-06-01",
//     titre: "Forum Entreprises",
//     heure: "9h - 16h",
//     lieu: "Sceaux",
//     description: "Rencontre entre étudiants et entreprises avec stands, entretiens et ateliers.",
//     categorie: "career",
//     color: "#10B981", // Vert comme Ingénierie des Systèmes
//     gradientColors: ["#ECFDF5", "#D1FAE5"],
//   },
//   {
//     id: "3",
//     date: "2025-06-05",
//     titre: "Conférence IA",
//     heure: "14h - 16h",
//     lieu: "Online",
//     description: "Conférence sur l'impact de l'IA dans la recherche scientifique.",
//     categorie: "conference",
//     color: "#EC4899", // Rose comme Conseil
//     gradientColors: ["#FDF2F8", "#FCE7F3"],
//   },
//   {
//     id: "4",
//     date: "2025-06-11",
//     titre: "Workshop Design",
//     heure: "10h - 17h",
//     lieu: "Cachan",
//     description: "Atelier pratique sur les méthodes de design thinking et prototypage.",
//     categorie: "workshop",
//     color: "#06B6D4", // Cyan comme Traduction technique
//     gradientColors: ["#F0F9FF", "#E0F7FA"],
//   },
//   {
//     id: "5",
//     date: "2025-06-11",
//     titre: "Journée Portes Ouvertes",
//     heure: "9h - 16h",
//     lieu: "Sceaux",
//     description: "Découvrez nos campus et formations lors de notre journée portes ouvertes annuelle.",
//     categorie: "open",
//     color: "#8B5CF6", // Violet pour varier
//     gradientColors: ["#F5F3FF", "#EDE9FE"],
//   },
//   {
//     id: "6",
//     date: "2025-06-13",
//     titre: "Séminaire Recherche",
//     heure: "14h - 16h",
//     lieu: "Online",
//     description: "Présentation des derniers travaux de recherche de nos laboratoires.",
//     categorie: "research",
//     color: "#F59E0B", // Ambre pour varier
//     gradientColors: ["#FFFBEB", "#FEF3C7"],
//   },
// ]

const EvenementsScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null)
  const [showCalendar, setShowCalendar] = useState(true)
  const [showBar, setShowBar] = useState(false)
  const [barMessage, setBarMessage] = useState("")
  const { user, token } = useSession()

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current
  const scrollViewRef = useRef<ScrollView>(null)

  const today = new Date().toISOString().split("T")[0]

  const [evenements, setEvenements] = useState<Evenement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        const response = await api.get("/evenement/")
        const data = response.data

        console.log("✅ Données reçues :", data) // 👈 est-ce que ça s'affiche bien dans la console ?

        // Formatage des événements (adapter en fonction des noms SQL)
        const mappedEvents = data.map((event: any) => ({
          id: event.Id_Event.toString(),
          titre: event.titre_Event,
          description: event.description_Event,
          date: event.date_Event.split("T")[0],
          heure: event.horaire_Event,
          lieu: event.lieu_Event,
          categorie: getCategorie(event.ID_typeEvenement), // à définir plus bas
          color: getColor(event.ID_typeEvenement),
          gradientColors: getGradient(event.ID_typeEvenement),
        }))

        setEvenements(mappedEvents)
      } catch (error) {
        console.error("Erreur récupération événements :", error)
      } finally {
        setLoading(false)
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

  const evenementsFiltres = selectedDate
    ? evenements.filter((event) => event.date === selectedDate)
    : evenements
        .filter((event) => event.date >= today) // Filtrer les événements futurs et d'aujourd'hui
        .sort((a, b) => a.date.localeCompare(b.date))

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

    // Faire défiler vers la section des événements après sélection d'une date
    //setTimeout(() => {
    //  scrollViewRef.current?.scrollTo({ y: 400, animated: true })
    //}, 300)
  }

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar)
  }

  const handleInscription = () => {
    if (!selectedEvent) return

    const payload = {
      userId: user?.id,
      // eventId: selectedEvent.id,
      // nom: user.nom,
      email: user?.email,
      // eventTitre: selectedEvent.titre,
    }

    console.log("Inscription envoyée :", payload)

    setBarMessage(`Vous êtes inscrit à "${selectedEvent.titre}"`)
    setShowBar(true)
    setModalVisible(false)
  }

  // Animation quand la date sélectionnée change
  useEffect(() => {
    fadeAnim.setValue(0)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [selectedDate])

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <HeaderPage title="Évènements" />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="always"
      >
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

        {/* Titre de section */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            {selectedDate
              ? `Événements du ${formatDate(selectedDate).split(" ").slice(0, 2).join(" ")}`
              : "Prochains événements"}
          </Text>
          {selectedDate && (
            <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Tout voir</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Liste des événements */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {evenementsFiltres.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="calendar-outline" size={64} color="#94A3B8" />
              </View>
              <Text style={styles.emptyText}>Aucun événement {selectedDate ? "ce jour-là" : "à venir"}.</Text>
            </View>
          ) : (
            evenementsFiltres.map((item, index) => (
              <Animated2.View key={item.id} entering={FadeInDown.delay(index * 100).springify()}>
                <TouchableOpacity
                  style={styles.cardContainer}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedEvent(item)
                    setModalVisible(true)
                  }}
                >
                  <LinearGradient
                    colors={item.gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                  >
                    <View style={styles.cardContent}>
                      <View style={styles.imageContainer}>
                        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                          <Ionicons name={getCategoryIcon(item.categorie)} size={24} color="white" />
                        </View>
                        <View style={styles.imageOverlay} />
                      </View>

                      <View style={styles.textContainer}>
                        <Text style={[styles.cardTitle, { color: item.color }]}>{item.titre}</Text>
                        <Text style={styles.cardDescription} numberOfLines={2}>
                          {item.description}
                        </Text>

                        <View style={styles.eventDetails}>
                          <View style={styles.eventDetailItem}>
                            <Ionicons name="calendar-outline" size={14} color="#64748B" />
                            <Text style={styles.eventDetailText}>
                              {formatDate(item.date).split(" ").slice(0, 2).join(" ")}
                            </Text>
                          </View>
                          <View style={styles.eventDetailItem}>
                            <Ionicons name="time-outline" size={14} color="#64748B" />
                            <Text style={styles.eventDetailText}>{item.heure}</Text>
                          </View>
                          <View style={styles.eventDetailItem}>
                            <Ionicons name="location-outline" size={14} color="#64748B" />
                            <Text style={styles.eventDetailText}>{item.lieu}</Text>
                          </View>
                        </View>

                        <View style={styles.learnMoreButton}>
                          <Text style={[styles.learnMoreText, { color: item.color }]}>En savoir plus</Text>
                          <Ionicons name="arrow-forward" size={16} color={item.color} style={styles.arrowIcon} />
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated2.View>
            ))
          )}
        </Animated.View>

        {/* Footer */}
        <FooterLogo />
      </ScrollView>

      {/* Modal détaillée de l'événement */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {selectedEvent && (
              <>
                <LinearGradient
                  colors={selectedEvent.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalHeader}
                >
                  <View style={[styles.modalIconContainer, { backgroundColor: selectedEvent.color }]}>
                    <Ionicons name={getCategoryIcon(selectedEvent.categorie)} size={32} color="white" />
                  </View>
                </LinearGradient>

                <View style={styles.closeIconContainer}>
                  <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={20} color="#64748B" />
                  </Pressable>
                </View>

                <View style={styles.modalBody}>
                  <Text style={[styles.modalTitle, { color: selectedEvent.color }]}>{selectedEvent.titre}</Text>

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

                  <TouchableOpacity
                    style={[styles.inscriptionButton, { backgroundColor: selectedEvent.color }]}
                    onPress={handleInscription}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.inscriptionButtonText}>S'inscrire</Text>
                    <Ionicons name="arrow-forward" size={18} color="white" style={styles.arrowIcon} />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <MiniBar
        visible={showBar}
        message={barMessage}
        onClose={() => setShowBar(false)}
        duration={3000}
        color="#10B981"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    marginTop: 10,
    marginBottom: 5,
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
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  calendar: {
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
  },
  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  resetButton: {
    padding: 6,
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
    padding: 16,
    minHeight: 120,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: "row",
    marginBottom: 8,
  },
  eventDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  eventDetailText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 4,
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
    marginTop: 20,
  },
  emptyImage: {
    width: 80,
    height: 80,
    opacity: 0.6,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 16,
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
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    maxHeight: "80%",
  },
  modalHeader: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
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
  inscriptionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  inscriptionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
  closeIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#F1F5F9",
    borderRadius: 40,
  },
})

export default EvenementsScreen
