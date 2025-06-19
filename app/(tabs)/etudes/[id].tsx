"use client"

import api from "@/api/axiosClient"
import FooterLogo from "@/components/FooterLogo"
import { useSession } from "@/contexts/AuthContext"
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

type Etude = {
  id: string
  title: string
  description: string
  dateDebut: string
  dateFin: string
  prix: number
  image: string
  dateCreation: string
  nbrIntervenant: number
  statut: number
  category: string
}

type TeamMember = {
  id: number
  name: string
  role: string
}

export default function EtudeDetailScreen() {
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [etude, setEtude] = useState<Etude | null>(null)
  const [error, setError] = useState<string | null>(null)

  const params = useLocalSearchParams()
  const router = useRouter()
  const { user, token, isLoading } = useSession()

  const { id } = params

  // Fonction pour obtenir une couleur basée sur la catégorie
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      "IT & Digital": { bg: "#E3F2FD", text: "#2196F3" },
      "Ingénierie des Systèmes": { bg: "#E8F5E8", text: "#4CAF50" },
      Conseil: { bg: "#FCE4EC", text: "#E91E63" },
      RSE: { bg: "#FFF3E0", text: "#FF9800" },
      "Digital & Culture": { bg: "#F3E5F5", text: "#9C27B0" },
      "Traduction Technique": { bg: "#E0F2F1", text: "#00BCD4" },
      Autre: { bg: "#F5F5F5", text: "#757575" },
    }
    return colors[category] || colors["Autre"]
  }

  // Fonction pour calculer la durée en mois
  const calculateDuration = (dateDebut: string, dateFin: string) => {
    const debut = new Date(dateDebut)
    const fin = new Date(dateFin)
    const diffTime = Math.abs(fin.getTime() - debut.getTime())
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    return `${diffMonths} mois`
  }

  // Fonction pour déterminer le niveau basé sur le nombre d'intervenants
  const getLevel = (nbrIntervenant: number) => {
    if (nbrIntervenant === 1) return "Débutant"
    if (nbrIntervenant === 2) return "Intermédiaire"
    return "Avancé"
  }

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Équipe fictive basée sur la catégorie
  const getTeamMembers = (category: string): TeamMember[] => {
    const teams: { [key: string]: TeamMember[] } = {
      "IT & Digital": [
        { id: 1, name: "Marie Dupont", role: "Lead Developer" },
        { id: 2, name: "Thomas Martin", role: "UX Designer" },
        { id: 3, name: "Julie Lefebvre", role: "Backend Developer" },
      ],
      "Ingénierie des Systèmes": [
        { id: 4, name: "Dr. Sophie Bernard", role: "Directrice de recherche" },
        { id: 5, name: "Alexandre Petit", role: "Ingénieur systèmes" },
        { id: 6, name: "Emma Dubois", role: "Chercheuse" },
      ],
      Conseil: [
        { id: 7, name: "Nicolas Robert", role: "Consultant senior" },
        { id: 8, name: "Camille Leroy", role: "Analyste" },
      ],
      RSE: [
        { id: 9, name: "Maxime Girard", role: "Expert RSE" },
        { id: 10, name: "Laura Moreau", role: "Consultante environnement" },
      ],
      "Digital & Culture": [
        { id: 11, name: "Antoine Dubois", role: "Designer créatif" },
        { id: 12, name: "Céline Martin", role: "Chef de projet digital" },
      ],
      "Traduction Technique": [
        { id: 13, name: "Pierre Lefevre", role: "Traducteur technique" },
        { id: 14, name: "Sophie Rousseau", role: "Linguiste" },
      ],
    }
    return (
      teams[category] || [
        { id: 1, name: "Dr. Nom Prénom", role: "Directeur de formation" },
        { id: 2, name: "Dr. Nom Prénom", role: "Formateur" },
      ]
    )
  }

  useEffect(() => {
    const fetchEtudeDetails = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)

        // Récupérer toutes les études
        const response = await api.get("/etude/")
        const rawEtudes = response.data

        // Transformer les données
        const formattedEtudes: Etude[] = rawEtudes.map((etude: any) => ({
          id: etude.Id_etude?.toString() || `etude-${Math.random()}`,
          title: etude.titre_etude ?? "Titre manquant",
          description: etude.description_etude ?? "Pas de description",
          dateDebut: etude.dateDebut_etude ?? "",
          dateFin: etude.dateFin_etude ?? "",
          prix: etude.prix_etude ?? 0,
          image: etude.img_etude
            ? etude.img_etude.startsWith("http")
              ? etude.img_etude
              : `https://votre-domaine.com/images/${etude.img_etude}`
            : "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop",
          dateCreation: etude.dateCreation_etude ?? "",
          nbrIntervenant: etude.nbrIntervenant ?? 1,
          statut: etude.ID_statutE ?? 3,
          category: etude.categorie ?? "Autre",
        }))

        // Trouver l'étude spécifique
        const currentEtude = formattedEtudes.find((etude) => etude.id === id)

        if (currentEtude) {
          setEtude(currentEtude)
        } else {
          setError("Étude non trouvée")
        }
      } catch (err) {
        console.error("Erreur récupération étude:", err)
        setError("Erreur lors du chargement de l'étude")
      } finally {
        setLoading(false)
      }
    }

    fetchEtudeDetails()
  }, [id])

  const handlePostuler = async () => {
    if (!etude) return

    if (!user) {
      Alert.alert("Connexion requise", "Vous devez être connecté pour vous inscrire à une étude.")
      return
    }

    try {
      const inscriptionData = {
        Id_etude: Number.parseInt(etude.id),
        ID_user: user.id,
      }

      const response = await api.post("/etude/inscription/", inscriptionData)

      if (response.status === 201) {
        Alert.alert(
          "Inscription réussie",
          `Votre inscription à "${etude.title}" a été confirmée. Vous recevrez plus d'informations dans les prochains jours.`,
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        )
      }
    } catch (err: any) {
      // Gestion spécifique des erreurs sans log dans la console
      if (err.response?.status === 409) {
        Alert.alert("Déjà inscrit", "Vous êtes déjà inscrit à cette étude.")
      } else if (err.response?.status === 400) {
        Alert.alert("Erreur", "Données invalides. Veuillez réessayer.")
      } else {
        console.error("Erreur inscription:", err)
        Alert.alert("Erreur", "Impossible de s'inscrire à cette étude. Veuillez réessayer.")
      }
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Chargement de l'étude...</Text>
        </View>
      </View>
    )
  }

  if (error || !etude) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Étude non trouvée"}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const categoryColors = getCategoryColor(etude.category)
  const teamMembers = getTeamMembers(etude.category)
  const duration = calculateDuration(etude.dateDebut, etude.dateFin)

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header image */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: etude.image }} style={styles.headerImage} />
        <LinearGradient colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]} style={styles.headerGradient} />

        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={router.back}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Bookmark button */}
        <TouchableOpacity style={styles.bookmarkButton} onPress={() => setBookmarked(!bookmarked)}>
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={bookmarked ? "#3B82F6" : "white"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={[styles.categoryBadge, { backgroundColor: categoryColors.bg }]}
          >
            <Text style={[styles.categoryText, { color: categoryColors.text }]}>{etude.category}</Text>
          </Animated.View>

          <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.title}>
            {etude.title}
          </Animated.Text>

          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <FontAwesome5 name="users" size={18} color="#3B82F6" />
              <View>
                <Text style={styles.infoLabel}>Participants</Text>
                <Text style={styles.infoValue}>{etude.nbrIntervenant} intervenant(s)</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="calendar-range" size={20} color="#3B82F6" />
              <View>
                <Text style={styles.infoLabel}>Dates</Text>
                <Text style={styles.infoValue}>
                  {formatDate(etude.dateDebut)} - {formatDate(etude.dateFin)}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#3B82F6" />
              <View>
                <Text style={styles.infoLabel}>Durée</Text>
                <Text style={styles.infoValue}>{duration}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="currency-eur" size={20} color="#3B82F6" />
              <View>
                <Text style={styles.infoLabel}>Budget</Text>
                <Text style={styles.infoValue}>{etude.prix.toLocaleString()} €</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
            <Text style={styles.sectionTitle}>À propos de cette formation</Text>
            <Text style={styles.description}>{etude.description}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.section}>
            <Text style={styles.sectionTitle}>Équipe pédagogique</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teamScroll}>
              {teamMembers.map((member, index) => (
                <View key={member.id} style={styles.teamMember}>
                  <Image
                    source={{
                      uri: `https://randomuser.me/api/portraits/${index % 2 === 0 ? "women" : "men"}/${index + 10}.jpg`,
                    }}
                    style={styles.teamMemberImage}
                  />
                  <Text style={styles.teamMemberName}>{member.name}</Text>
                  <Text style={styles.teamMemberRole}>{member.role}</Text>
                </View>
              ))}
            </ScrollView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.publicationInfo}>
            <Text style={styles.publicationLabel}>Formation publiée le:</Text>
            <Text style={styles.publicationDate}>{formatDate(etude.dateCreation)}</Text>
          </Animated.View>

          <AnimatedTouchable
            entering={FadeInUp.delay(800).springify()}
            style={styles.applyButton}
            onPress={handlePostuler}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[categoryColors.text, categoryColors.text]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.applyButtonGradient}
            >
              <Text style={styles.applyButtonText}>Postuler à cette étude</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </LinearGradient>
          </AnimatedTouchable>
        </View>
        <FooterLogo />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748B",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "600",
  },
  headerContainer: {
    height: 240,
    width: "100%",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  bookmarkButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 24,
    lineHeight: 32,
  },
  infoCardsContainer: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    flex: 1,
    flexWrap: "wrap",
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
    marginBottom: 12,
  },
  periodText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
    fontWeight: "600",
  },
  teamScroll: {
    marginLeft: -8,
  },
  teamMember: {
    width: 100,
    marginHorizontal: 8,
    alignItems: "center",
  },
  teamMemberImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  teamMemberName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
  teamMemberRole: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  publicationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  publicationLabel: {
    fontSize: 14,
    color: "#64748B",
    marginRight: 8,
  },
  publicationDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  applyButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
  },
  applyButtonGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
