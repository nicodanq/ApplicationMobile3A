"use client"
import api from "@/api/axiosClient"
import { useSession } from "@/contexts/AuthContext"
import { useUserDetails } from "@/hooks/useUserDetails"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native"

function getCategoryColor(type: string): string {
  switch (type.toLowerCase()) {
    case "formation":
      return "#2196F3"
    case "afterwork":
      return "#34C759" // Vert plus vif
    case "forum":
      return "#FF2D92"
    default:
      return "#9E9E9E"
  }
}

function getCategoryIcon(type: string): string {
  switch (type.toLowerCase()) {
    case "formation":
      return "school"
    case "atelier":
      return "wine"
    case "forum":
      return "people"
    default:
      return "calendar"
  }
}

const ParticipationEvenementsScreen = () => {
  const router = useRouter()
  const { user } = useSession()
  const { details, role, loading, error } = useUserDetails(user?.id ?? null)

  const [events, setEvents] = useState<any[]>([])
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isUnsubscribing, setIsUnsubscribing] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    const fetchEvents = async () => {
      try {
        const response = await api.get(`/user/events/${user.id}`)
        console.log("Événements récupérés :", response.data)
        const fetchedEvents = response.data

        const formattedEvents = fetchedEvents.map((event: any) => ({
          id: String(event.Id_Event),
          title: event.titre_Event,
          category: event.typeEvent,
          description: event.description_Event || "Description de l'événement",
          date: new Date(event.date_Event).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          address: event.lieu_Event,
          time: event.horaire_Event?.slice(0, 5) || "00:00",
          categoryColor: getCategoryColor(event.typeEvent),
          categoryIcon: getCategoryIcon(event.typeEvent),
        }))

        setEvents(formattedEvents)
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error)
        Alert.alert("Erreur", "Impossible de récupérer les événements.")
      }
    }

    fetchEvents()
  }, [user?.id])

  const handleEventPress = (event: any) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  const handleUnsubscribe = async () => {
    if (!selectedEvent || !user?.id) return

    try {
      setIsUnsubscribing(true)

      // Appel API pour désinscrire l'utilisateur
      const response = await api.delete("/evenement/desinscrire", {
        data: {
          Id_Event: Number.parseInt(selectedEvent.id),
          ID_user: user.id,
        },
      })

      if (response.status === 200) {
        // Mettre à jour la liste des événements
        setEvents(events.filter((event) => event.id !== selectedEvent.id))
        setShowEventModal(false)
        setSelectedEvent(null)
        Alert.alert("Succès", "Vous ne participez plus à cet événement")
      }
    } catch (error: any) {
      console.error("Erreur lors de la désinscription :", error)
      const errorMessage = error.response?.data?.message || "Erreur lors de la désinscription"
      Alert.alert("Erreur", errorMessage)
    } finally {
      setIsUnsubscribing(false)
    }
  }

  const closeModal = () => {
    setShowEventModal(false)
    setSelectedEvent(null)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Participation aux événements</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {events.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Aucun événement</Text>
              <Text style={styles.emptyText}>Vous ne participez à aucun événement pour le moment</Text>
            </View>
          ) : (
            events.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                activeOpacity={0.7}
                onPress={() => handleEventPress(event)}
              >
                <View style={styles.eventContent}>
                  <View style={[styles.eventIcon, { backgroundColor: event.categoryColor }]}>
                    <Ionicons name={event.categoryIcon as any} size={24} color="white" />
                  </View>

                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDescription}>{event.description}</Text>

                    <View style={styles.eventDetails}>
                      <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
                        <Text style={styles.detailText}>{event.date}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={16} color="#8E8E93" />
                        <Text style={styles.detailText}>{event.time}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={16} color="#8E8E93" />
                        <Text style={styles.detailText}>{event.address}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.chevronContainer}>
                    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Event Detail Modal */}
      <Modal visible={showEventModal} transparent={true} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.eventModalContainer}>
            {selectedEvent && (
              <>
                {/* Header with icon and close button */}
                <View style={styles.eventModalHeader}>
                  <View style={[styles.modalEventIcon, { backgroundColor: selectedEvent.categoryColor }]}>
                    <Ionicons name={selectedEvent.categoryIcon as any} size={32} color="white" />
                  </View>
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Ionicons name="close" size={24} color="#8E8E93" />
                  </TouchableOpacity>
                </View>

                {/* Event title */}
                <Text style={styles.modalEventTitle}>{selectedEvent.title}</Text>

                {/* Event details card */}
                <View style={styles.eventDetailsCard}>
                  <View style={styles.modalDetailRow}>
                    <View style={styles.modalDetailItem}>
                      <Ionicons name="time-outline" size={20} color="#8E8E93" />
                      <Text style={styles.modalDetailText}>{selectedEvent.time}</Text>
                    </View>
                    <View style={styles.modalDetailItem}>
                      <Ionicons name="location-outline" size={20} color="#8E8E93" />
                      <Text style={styles.modalDetailText}>{selectedEvent.address}</Text>
                    </View>
                  </View>
                  <View style={styles.modalDetailItem}>
                    <Ionicons name="calendar-outline" size={20} color="#8E8E93" />
                    <Text style={styles.modalDetailText}>{selectedEvent.date}</Text>
                  </View>
                </View>

                {/* Description */}
                <View style={styles.descriptionSection}>
                  <Text style={styles.descriptionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>{selectedEvent.description}</Text>
                </View>

                {/* Unsubscribe button */}
                <TouchableOpacity
                  style={[styles.unsubscribeButton, isUnsubscribing && styles.unsubscribeButtonDisabled]}
                  onPress={handleUnsubscribe}
                  disabled={isUnsubscribing}
                >
                  {isUnsubscribing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.unsubscribeButtonText}>Ne plus participer</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  eventContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 12,
  },
  eventDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 6,
  },
  chevronContainer: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#64748B",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center", // Changé de "flex-end" à "center"
    alignItems: "center",
    paddingHorizontal: 20,
  },
  eventModalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24, // Changé de borderTopLeftRadius/borderTopRightRadius
    padding: 24,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  eventModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalEventIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
  modalEventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D1D1F",
    marginBottom: 20,
    textAlign: "center",
  },
  eventDetailsCard: {
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  modalDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalDetailText: {
    fontSize: 16,
    color: "#1D1D1F",
    marginLeft: 8,
    fontWeight: "500",
  },
  descriptionSection: {
    marginBottom: 32,
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
  unsubscribeButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  unsubscribeButtonDisabled: {
    opacity: 0.6,
  },
  unsubscribeButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})

export default ParticipationEvenementsScreen
