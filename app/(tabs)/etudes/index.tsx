"use client"

<<<<<<< liaisonbdd3
import api from "@/api/axiosClient"
import FooterLogo from "@/components/FooterLogo"
import HeaderPage from "@/components/HeaderPage"
import { useSession } from "@/contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
=======
import FooterLogo from "@/components/FooterLogo"
import HeaderPage from "@/components/HeaderPage"
import { Ionicons } from "@expo/vector-icons"

>>>>>>> main
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"


const { width } = Dimensions.get("window")
const CARD_WIDTH = width * 0.8

type Study = {
  id: string
  title: string
  description: string
  duration: string
  level: string
  image: string
  category: string
}

type StudyCategory = {
  id: string
  title: string
  color: string
  backgroundColor: string
  icon: string
  studies: Study[]
}

const EtudesScreen = () => {
  const router = useRouter()
  const { user, token, isLoading } = useSession()

  const [loading, setLoading] = useState(true)
  const [studyCategories, setStudyCategories] = useState<StudyCategory[]>([])
  const [error, setError] = useState<string | null>(null)

  // Configuration des couleurs par catégorie
  const getCategoryConfig = (categoryName: string) => {
    const configs: { [key: string]: { color: string; backgroundColor: string; icon: string } } = {
      "IT & Digital": { color: "#2196F3", backgroundColor: "#E3F2FD", icon: "💻" },
      "Ingénierie des Systèmes": { color: "#4CAF50", backgroundColor: "#E8F5E8", icon: "⚙️" },
      Conseil: { color: "#E91E63", backgroundColor: "#FCE4EC", icon: "💼" },
      RSE: { color: "#FF9800", backgroundColor: "#FFF3E0", icon: "🌱" },
      "Digital & Culture": { color: "#9C27B0", backgroundColor: "#F3E5F5", icon: "🎨" },
      "Traduction Technique": { color: "#00BCD4", backgroundColor: "#E0F2F1", icon: "🌐" },
      Autre: { color: "#757575", backgroundColor: "#F5F5F5", icon: "📚" },
    }
    return configs[categoryName] || configs["Autre"]
  }

  useEffect(() => {
    const fetchEtudes = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await api.get("/etude/")
        const rawEtudes = response.data

        // Transformer les données
        const formattedEtudes: Study[] = rawEtudes.map((etude: any) => ({
          id: etude.Id_etude?.toString() || `etude-${Math.random()}`,
          title: etude.titre_etude ?? "Titre manquant",
          description: etude.description_etude ?? "Pas de description",
          duration:
            etude.dateFin_etude && etude.dateDebut_etude
              ? `${Math.ceil((new Date(etude.dateFin_etude).getTime() - new Date(etude.dateDebut_etude).getTime()) / (1000 * 60 * 60 * 24 * 30))} mois`
              : "Non spécifiée",
          level: etude.nbrIntervenant
            ? etude.nbrIntervenant === 1
              ? "Débutant"
              : etude.nbrIntervenant === 2
                ? "Intermédiaire"
                : "Avancé"
            : "Débutant",
          image: etude.img_etude
            ? etude.img_etude.startsWith("http")
              ? etude.img_etude
              : `https://votre-domaine.com/images/${etude.img_etude}`
            : "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=200&fit=crop",
          category: etude.categorie ?? "Autre",
        }))

        // Grouper par catégorie
        const grouped: Record<string, Study[]> = formattedEtudes.reduce(
          (acc, study) => {
            if (!acc[study.category]) acc[study.category] = []
            acc[study.category].push(study)
            return acc
          },
          {} as Record<string, Study[]>,
        )

        // Créer les catégories avec configuration
        const categoriesArray: StudyCategory[] = Object.entries(grouped).map(([categoryName, studies]) => {
          const config = getCategoryConfig(categoryName)
          return {
            id: categoryName.toLowerCase().replace(/\s+/g, "-"),
            title: categoryName,
            color: config.color,
            backgroundColor: config.backgroundColor,
            icon: config.icon,
            studies,
          }
        })

        setStudyCategories(categoriesArray)
      } catch (err) {
        console.error("Erreur récupération études:", err)
        setError("Erreur lors du chargement des études")
        setStudyCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchEtudes()
  }, [])

  const handleStudyPress = (study: Study, category: StudyCategory) => {
    router.push({
      pathname: "/etudes/[id]",
      params: {
        id: study.id,
        studyTitle: study.title,
        studyDescription: study.description,
        studyDuration: study.duration,
        studyLevel: study.level,
        studyImage: study.image,
        categoryTitle: category.title,
        categoryColor: category.color,
        categoryBackground: category.backgroundColor,
      },
    } as any)
  }

  const renderStudyCard = ({ item: study, index }: { item: Study; index: number }, category: StudyCategory) => (
    <TouchableOpacity
      style={[styles.studyCard, { marginLeft: index === 0 ? 20 : 10 }]}
      onPress={() => handleStudyPress(study, category)}
      activeOpacity={0.7}
    >
      <View style={styles.studyImageContainer}>
        <Image source={{ uri: study.image }} style={styles.studyImage} />
        <View style={styles.studyImageOverlay} />
        <View style={[styles.levelBadge, { backgroundColor: category.backgroundColor }]}>
          <Text style={[styles.levelText, { color: category.color }]}>{study.level}</Text>
        </View>
      </View>

      <View style={styles.studyContent}>
        <Text style={styles.studyTitle} numberOfLines={2}>
          {study.title}
        </Text>
        <Text style={styles.studyDescription} numberOfLines={3}>
          {study.description}
        </Text>

        <View style={styles.studyMeta}>
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={14} color="#64748B" />
            <Text style={styles.durationText}>{study.duration}</Text>
          </View>
          <TouchableOpacity style={[styles.enrollButton, { backgroundColor: category.color }]}>
            <Text style={styles.enrollButtonText}>S&apos;inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderCategorySection = (category: StudyCategory) => (
    <View key={category.id} style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <View style={styles.categoryTitleContainer}>
          <View style={[styles.categoryIcon, { backgroundColor: category.backgroundColor }]}>
            <Text style={styles.categoryIconText}>{category.icon}</Text>
          </View>
          <View>
            <Text style={[styles.categoryTitle, { color: category.color }]}>{category.title}</Text>
            <Text style={styles.categorySubtitle}>
              {category.studies.length} formation{category.studies.length > 1 ? "s" : ""} disponible
              {category.studies.length > 1 ? "s" : ""}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={[styles.seeAllText, { color: category.color }]}>Voir tout</Text>
          <Ionicons name="chevron-forward" size={16} color={category.color} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={category.studies}
        renderItem={(props: any) => renderStudyCard(props, category)}
        keyExtractor={(item: Study) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.studiesCarousel}
      />
    </View>
  )

  // Calculs des statistiques
  const totalStudies = studyCategories.reduce((acc, cat) => acc + cat.studies.length, 0)
  const totalCategories = studyCategories.length

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <HeaderPage title="Études" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Chargement des études...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <HeaderPage title="Études" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header personnalisé */}
      <HeaderPage title="Études" />

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalStudies}</Text>
          <Text style={styles.statLabel}>Études</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalCategories}</Text>
          <Text style={styles.statLabel}>Domaines</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Inscriptions</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {studyCategories.length > 0 ? (
            studyCategories.map(renderCategorySection)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucune étude disponible pour le moment</Text>
            </View>
          )}
        </View>
        {/* Footer personnalisé */}
        <FooterLogo />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
  retryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryIconText: {
    fontSize: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  studiesCarousel: {
    paddingRight: 20,
  },
  studyCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginRight: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  studyImageContainer: {
    position: "relative",
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  studyImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  studyImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  levelBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "600",
  },
  studyContent: {
    padding: 16,
  },
  studyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
    lineHeight: 20,
  },
  studyDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 16,
  },
  studyMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 4,
  },
  enrollButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  enrollButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
})

export default EtudesScreen
