"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import React, { useEffect, useRef, useState } from "react"
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native"
import { Calendar } from "react-native-calendars"
import Toast from "react-native-toast-message"
import Animated2, { FadeInDown } from "react-native-reanimated"

import HeaderPage from "@/components/HeaderPage"
import FooterLogo from "@/components/FooterLogo"

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

const user = {
  id: "12345",
  nom: "Federico",
  email: "fede@mail.com",
}

// Données d'événements avec styles harmonisés avec l'écran d'études
const evenementsData: Evenement[] = [
  {
    id: "1",
    date: "2025-06-01",
    titre: "Hackathon EPF",
    heure: "10h - 17h",
    lieu: "Cachan",
    description: "Un hackathon organisé à l'EPF pour imaginer les solutions technologiques de demain.",
    categorie: "tech",
    color: "#3B82F6", // Bleu comme IT & Digital
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
    color: "#10B981", // Vert comme Ingénierie des Systèmes
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
    color: "#EC4899", // Rose comme Conseil
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
    color: "#06B6D4", // Cyan comme Traduction technique
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
    color: "#8B5CF6", // Violet pour varier
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
    color: "#F59E0B", // Ambre pour varier
    gradientColors: ["#FFFBEB", "#FEF3C7"],
  },
]

const EvenementsScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null)
  const [showCalendar, setShowCalendar] = useState(true)
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current
  const calendarFade = useRef(new Animated.Value(1)).current
  const calendarHeight = useRef(new Animated.Value(320)).current

  const today = new Date().toISOString().split("T")[0]

  const evenementsFiltres = selectedDate
    ? evenementsData.filter(event => event.date === selectedDate)
    : evenementsData
        .filter(event => event.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))

  const getMarkedDates = () => {
    const marked: { [date: string]: any } = {}
    evenementsData.forEach(event => {
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
        selectedColor: "#3B82F6",
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
          color: "#3B82F6",
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
    if (showCalendar) {
      // Masquer le calendrier
      Animated.parallel([
        Animated.timing(calendarHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(calendarFade, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShowCalendar(false))
    } else {
      // Afficher le calendrier
      setShowCalendar(true)
      Animated.parallel([
        Animated.timing(calendarHeight, {
          toValue: 320,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(calendarFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }

  const handleInscription = () => {
    if (!selectedEvent) return

    const payload = {
      userId: user.id,
      eventId: selectedEvent.id,
      nom: user.nom,
      email: user.email,
      eventTitre: selectedEvent.titre,
    }

    console.log("Inscription envoyée :", payload)

    Toast.show({
      type: "success",
      text1: "Inscription confirmée",
      text2: `Vous êtes inscrit à "${selectedEvent.titre}"`,
      visibilityTime: 3000,
      position: "bottom",
    })

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
      year: "numeric" 
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

      <View style={styles.calendarHeader}>
        <Text style={styles.calendarTitle}>
          {selectedDate ? formatDate(selectedDate) : "Calendrier des événements"}
        </Text>
        <TouchableOpacity 
          style={styles.calendarToggle} 
          onPress={toggleCalendar}
          activeOpacity={0.7}
        >
          <Text style={styles.calendarToggleText}>
            {showCalendar ? "Masquer" : "Afficher"}
          </Text>
          <Ionicons 
            name={showCalendar ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#3B82F6" 
          />
        </TouchableOpacity>
      </View>

      {/* Calendrier avec animation */}
      {showCalendar && (
        <Animated.View style={{ 
          opacity: calendarFade, 
          height: calendarHeight,
          overflow: "hidden"
        }}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={getMarkedDates()}
            markingType="custom"
            enableSwipeMonths={true}
            theme={{
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#3B82F6",
              selectedDayBackgroundColor: "#3B82F6",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#3B82F6",
              dayTextColor: "#1E293B",
              textDisabledColor: "#94A3B8",
              dotColor: "#3B82F6",
              selectedDotColor: "#ffffff",
              arrowColor: "#3B82F6",
              monthTextColor: "#3B82F6",
              textMonthFontWeight: "bold",
              textDayFontWeight: "600",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 14,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            style={styles.calendar}
          />
        </Animated.View>
      )}

      {/* Titre de section */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>
          {selectedDate 
            ? `Événements du ${formatDate(selectedDate).split(" ").slice(0, 2).join(" ")}` 
            : "Prochains événements"}
        </Text>
        {selectedDate && (
          <TouchableOpacity 
            onPress={() => setSelectedDate(null)}
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>Tout voir</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Liste des événements avec animation */}
      <Animated.View style={[{ opacity: fadeAnim }, { flex: 1 }]}>
        <FlatList
          data={evenementsFiltres}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <Animated2.View
              entering={FadeInDown.delay(index * 100).springify()}
            >
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
                          <Ionicons name="time-outline" size={14} color="#64748B" />
                          <Text style={styles.eventDetailText}>{item.heure}</Text>
                        </View>
                        <View style={styles.eventDetailItem}>
                          <Ionicons name="location-outline" size={14} color="#64748B" />
                          <Text style={styles.eventDetailText}>{item.lieu}</Text>
                        </View>
                      </View>

                      <TouchableOpacity style={styles.learnMoreButton}>
                        <Text style={[styles.learnMoreText, { color: item.color }]}>En savoir plus</Text>
                        <Ionicons name="arrow-forward" size={16} color={item.color} style={styles.arrowIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated2.View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image 
                source={require("../../../assets/images/EPF_Projets_Logo.png")} 
                style={styles.emptyImage} 
              />
              <Text style={styles.emptyText}>
                Aucun événement {selectedDate ? "ce jour-là" : "à venir"}.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={<FooterLogo />}
        />
      </Animated.View>

      {/* Modal détaillée de l'événement */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            {selectedEvent && (
              <>
                <LinearGradient
                  colors={selectedEvent.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalHeader}
                >
                  <View style={[styles.modalIconContainer, { backgroundColor: selectedEvent.color }]}>
                    <Ionicons 
                      name={getCategoryIcon(selectedEvent.categorie)} 
                      size={32} 
                      color="white" 
                    />
                  </View>
                </LinearGradient>
                
                <View style={styles.closeIconContainer}>
                  <Pressable 
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={20} color="#64748B" />
                  </Pressable>
                </View>
                
                <View style={styles.modalBody}>
                  <Text style={[styles.modalTitle, { color: selectedEvent.color }]}>
                    {selectedEvent.titre}
                  </Text>
                  
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
                      <Text style={styles.modalDetailText}>
                        {formatDate(selectedEvent.date)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.modalDescriptionTitle}>Description</Text>
                  <Text style={styles.modalDescription}>
                    {selectedEvent.description}
                  </Text>
                  
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

      <Toast />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 4,
  },
  calendar: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 20,
    height: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    color: "#3B82F6",
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
  listContent: {
    paddingBottom: 40,
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
})

export default EvenementsScreen