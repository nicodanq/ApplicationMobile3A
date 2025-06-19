"use client"

import { useSession } from "@/contexts/AuthContext"
import { useUserDetails } from "@/hooks/useUserDetails"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { Animated, StatusBar, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from "react-native"
import HeaderPage from "@/components/HeaderPage"
import FooterLogo from "@/components/FooterLogo"
import api from "@/api/axiosClient"

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
}

type Article = {
  Id_article: number
  titre_article: string
  description_article: string
  datePublication_article: string
  img_article: string
  auteur_article: string
  ID_user: number
  readTime: number
  categorie: string
}

export default function HomeScreen() {
  const router = useRouter()
  const { user } = useSession()
  const { details, loading, error } = useUserDetails(user?.id ?? null)

  const [nextEvent, setNextEvent] = useState<Evenement | null>(null)
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [suggestedArticle, setSuggestedArticle] = useState<Article | null>(null)
  const [loadingArticle, setLoadingArticle] = useState(true)

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current

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

  // Récupérer le prochain événement
  useEffect(() => {
    const fetchNextEvent = async () => {
      try {
        const response = await api.get("/evenement/")
        const data = response.data

        const today = new Date().toISOString().split("T")[0]
        const futureEvents = data
          .filter((event: any) => {
            const eventDate = event.date_Event.split("T")[0]
            return eventDate >= today && !event.description_Event.includes("ANNULÉ")
          })
          .sort((a: any, b: any) => a.date_Event.localeCompare(b.date_Event))

        if (futureEvents.length > 0) {
          const event = futureEvents[0]
          setNextEvent({
            id: event.Id_Event.toString(),
            titre: event.titre_Event,
            description: event.description_Event,
            date: event.date_Event.split("T")[0],
            heure: convertTimeToHeure(event.horaire_Event),
            lieu: event.lieu_Event,
            categorie: getCategorie(event.ID_typeEvenement),
            color: getColor(event.ID_typeEvenement, event.description_Event),
          })
        }
      } catch (error) {
        console.error("Erreur récupération prochain événement :", error)
      } finally {
        setLoadingEvent(false)
      }
    }

    fetchNextEvent()
  }, [])

  // Récupérer l'article suggéré
  useEffect(() => {
    const fetchSuggestedArticle = async () => {
      try {
        const response = await api.get("/article/suggested")
        setSuggestedArticle(response.data)
      } catch (error) {
        console.error("Erreur récupération article suggéré :", error)
      } finally {
        setLoadingArticle(false)
      }
    }

    fetchSuggestedArticle()
  }, [])

  // Animation d'entrée
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
    }
    return date.toLocaleDateString("fr-FR", options)
  }

  const handleNavigateToStudies = useCallback(() => {
    router.push("/(tabs)/etudes")
  }, [router])

  const handleNavigateToEvents = useCallback(() => {
    router.push("/(tabs)/evenements")
  }, [router])

  const handleNavigateToArticles = useCallback(() => {
    router.push("/(tabs)/articles")
  }, [router])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur lors du chargement</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <HeaderPage title="Accueil" />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Message de bienvenue */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>
              Bonjour {details?.prenom_user} {details?.nom_user} 👋
            </Text>
            <Text style={styles.welcomeSubtitle}>Ravi de vous revoir !</Text>
          </View>

          {/* Prochain événement */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <View style={[styles.sectionIcon, { backgroundColor: "#E8F5E8" }]}>
                  <Ionicons name="calendar" size={20} color="#34C759" />
                </View>
              </View>
              <Text style={styles.sectionTitle}>Prochain événement</Text>
            </View>

            {loadingEvent ? (
              <View style={styles.loadingCard}>
                <Text style={styles.loadingCardText}>Chargement...</Text>
              </View>
            ) : nextEvent ? (
              <TouchableOpacity style={styles.eventCard} onPress={handleNavigateToEvents} activeOpacity={0.8}>
                <View style={styles.eventHeader}>
                  <View style={[styles.eventIcon, { backgroundColor: nextEvent.color }]}>
                    <Ionicons name={getCategoryIcon(nextEvent.categorie)} size={20} color="white" />
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{nextEvent.titre}</Text>
                    <Text style={styles.eventDescription} numberOfLines={2}>
                      {nextEvent.description}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </View>

                <View style={styles.eventDetails}>
                  <View style={styles.eventDetailItem}>
                    <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
                    <Text style={styles.eventDetailText}>{formatDate(nextEvent.date)}</Text>
                  </View>
                  <View style={styles.eventDetailItem}>
                    <Ionicons name="time-outline" size={16} color="#8E8E93" />
                    <Text style={styles.eventDetailText}>{nextEvent.heure}</Text>
                  </View>
                  <View style={styles.eventDetailItem}>
                    <Ionicons name="location-outline" size={16} color="#8E8E93" />
                    <Text style={styles.eventDetailText}>{nextEvent.lieu}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="calendar-outline" size={48} color="#C7C7CC" />
                <Text style={styles.emptyText}>Aucun événement à venir</Text>
                <TouchableOpacity onPress={handleNavigateToEvents}>
                  <Text style={styles.emptyLink}>Voir tous les événements</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Article suggéré */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <View style={[styles.sectionIcon, { backgroundColor: "#FFF3E0" }]}>
                  <Ionicons name="document-text" size={20} color="#FF9800" />
                </View>
              </View>
              <Text style={styles.sectionTitle}>Article suggéré</Text>
            </View>

            {loadingArticle ? (
              <View style={styles.loadingCard}>
                <Text style={styles.loadingCardText}>Chargement...</Text>
              </View>
            ) : suggestedArticle ? (
              <TouchableOpacity style={styles.articleCard} onPress={handleNavigateToArticles} activeOpacity={0.8}>
                <View style={styles.articleImageContainer}>
                  <Image source={{ uri: suggestedArticle.img_article }} style={styles.articleImage} />
                </View>
                <View style={styles.articleContentContainer}>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {suggestedArticle.titre_article}
                  </Text>
                  <Text style={styles.articleDescription} numberOfLines={3}>
                    {suggestedArticle.description_article}
                  </Text>
                  <View style={styles.articleMeta}>
                    <Ionicons name="time-outline" size={16} color="#8E8E93" />
                    <Text style={styles.articleMetaText}>{suggestedArticle.readTime} min</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="document-text-outline" size={48} color="#C7C7CC" />
                <Text style={styles.emptyText}>Aucun article disponible</Text>
              </View>
            )}
          </View>

          {/* Bouton Études */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.studiesButton} onPress={handleNavigateToStudies} activeOpacity={0.8}>
              <View style={styles.studiesButtonContent}>
                <View style={[styles.studiesButtonIcon, { backgroundColor: "#E3F2FD" }]}>
                  <Ionicons name="book" size={32} color="#007AFF" />
                </View>
                <View style={styles.studiesButtonInfo}>
                  <Text style={styles.studiesButtonTitle}>Découvrir les études</Text>
                  <Text style={styles.studiesButtonSubtitle}>Explorez nos formations et parcours disponibles</Text>
                </View>
                <Ionicons name="arrow-forward" size={24} color="#007AFF" />
              </View>
            </TouchableOpacity>
          </View>

          <FooterLogo />
        </ScrollView>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
  },
  welcomeSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1D1D1F",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIconContainer: {
    marginRight: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  loadingCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  loadingCardText: {
    color: "#8E8E93",
  },
  eventCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  eventIcon: {
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
  eventDescription: {
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
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 12,
    marginBottom: 8,
  },
  emptyLink: {
    fontSize: 14,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  studiesButton: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 20,
  },
  studiesButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  studiesButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  studiesButtonInfo: {
    flex: 1,
  },
  studiesButtonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  studiesButtonSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 18,
  },
  articleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  articleImageContainer: {
    width: "100%",
    height: 160,
  },
  articleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  articleContentContainer: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
    lineHeight: 22,
  },
  articleDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
    marginBottom: 12,
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  articleMetaText: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 6,
  },
})
