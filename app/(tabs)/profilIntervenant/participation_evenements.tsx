"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
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
} from "react-native"

const ParticipationEvenementsScreen = () => {
  const router = useRouter()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  // Données d'exemple des événements auxquels l'utilisateur participe
  const participatingEvents = [
    {
      id: "1",
      title: "Apprendre à coder",
      category: "Formation",
      date: "24/05/2025",
      address: "55 avenue du Président Wilson, 94230 Cachan",
      time: "18h-22h",
      categoryColor: "#2196F3",
    },
    {
      id: "2",
      title: "Apprendre à coder",
      category: "Formation",
      date: "24/05/2025",
      address: "55 avenue du Président Wilson, 94230 Cachan",
      time: "18h-22h",
      categoryColor: "#2196F3",
    },
    {
      id: "3",
      title: "Workshop Design Thinking",
      category: "Atelier",
      date: "15/06/2025",
      address: "12 rue de la Innovation, 75001 Paris",
      time: "14h-17h",
      categoryColor: "#4CAF50",
    },
  ]

  const [events, setEvents] = useState(participatingEvents)

  const handleUnsubscribe = (eventId: string) => {
    setSelectedEventId(eventId)
    setShowConfirmModal(true)
  }

  const confirmUnsubscribe = () => {
    if (selectedEventId) {
      setEvents(events.filter((event) => event.id !== selectedEventId))
      setShowConfirmModal(false)
      setSelectedEventId(null)
      Alert.alert("Succès", "Vous ne participez plus à cet événement")
    }
  }

  const cancelUnsubscribe = () => {
    setShowConfirmModal(false)
    setSelectedEventId(null)
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
              <View key={event.id} style={styles.eventCard}>
                {/* Header with title and unsubscribe button */}
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <TouchableOpacity style={styles.unsubscribeButton} onPress={() => handleUnsubscribe(event.id)}>
                    <Ionicons name="close-circle-outline" size={24} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* Category Badge */}
                <View style={[styles.categoryBadge, { backgroundColor: event.categoryColor + "20" }]}>
                  <Text style={[styles.categoryText, { color: event.categoryColor }]}>{event.category}</Text>
                </View>

                {/* Event Details */}
                <View style={styles.eventDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#64748B" />
                    <Text style={styles.detailText}>{event.date}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color="#64748B" />
                    <Text style={styles.detailText}>{event.address}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color="#64748B" />
                    <Text style={styles.detailText}>{event.time}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent={true} animationType="fade" onRequestClose={cancelUnsubscribe}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning-outline" size={32} color="#E53E3E" />
              <Text style={styles.modalTitle}>Confirmer la désinscription</Text>
            </View>

            <Text style={styles.modalText}>Êtes-vous sûr de ne plus vouloir participer à cet événement ?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={cancelUnsubscribe}>
                <Text style={styles.cancelButtonText}>Non</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={confirmUnsubscribe}>
                <Text style={styles.confirmButtonText}>Oui</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    flex: 1,
    marginRight: 10,
  },
  unsubscribeButton: {
    padding: 4,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  eventDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#64748B",
    flex: 1,
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 300,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 8,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F1F5F9",
  },
  confirmButton: {
    backgroundColor: "#E53E3E",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})

export default ParticipationEvenementsScreen
