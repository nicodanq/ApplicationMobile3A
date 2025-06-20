"use client"

import { useCallback, useState } from "react"

import api from "@/api/axiosClient"
import FooterLogo from "@/components/FooterLogo"
import { useSession } from "@/contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import { useRouter } from "expo-router"
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
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"


const { width } = Dimensions.get("window")
const cardWidth = width * 0.75

type Etude = {
  id: string
  titre: string
  description: string
  type: string
  prix: number
  nbrIntervenant: number
  dateDebut: string
  dateFin: string
  image: string
  statut: number
}

type EtudesData = {
  pasCommencees: Etude[]
  enCours: Etude[]
  terminees: Etude[]
}

const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    "IT & Digital": "#3B82F6",
    "Ingénierie des Systèmes": "#10B981",
    Conseil: "#8B5CF6",
    RSE: "#F59E0B",
    "Digital & Culture": "#EF4444",
    "Traduction Technique": "#06B6D4",
    Autre: "#64748B",
  }
  return colors[type] || "#64748B"
}

const EtudeCard = ({ etude, onPress }: { etude: Etude; onPress: () => void }) => (
  <TouchableOpacity style={styles.etudeCard} onPress={onPress} activeOpacity={0.7}>
    <Image source={{ uri: etude.image }} style={styles.etudeImage} />
    <View style={styles.etudeContent}>
      <View style={styles.etudeHeader}>
        <Text style={styles.etudeTitle} numberOfLines={2}>
          {etude.titre}
        </Text>
        <View style={[styles.typeTag, { backgroundColor: getTypeColor(etude.type) }]}>
          <Text style={styles.typeText}>{etude.type}</Text>
        </View>
      </View>
      <Text style={styles.etudeDescription} numberOfLines={2}>
        {etude.description}
      </Text>
      <View style={styles.etudeFooter}>
        <View style={styles.etudeInfo}>
          <Ionicons name="people-outline" size={16} color="#64748B" />
          <Text style={styles.etudeInfoText}>{etude.nbrIntervenant} intervenant(s)</Text>
        </View>
        <Text style={styles.etudePrix}>{etude.prix.toLocaleString()}€</Text>
      </View>
    </View>
  </TouchableOpacity>
)

const EtudesAdminScreen = () => {
  const router = useRouter()
  const { user, token, isLoading } = useSession()

  const [loading, setLoading] = useState(true)
  const [etudesData, setEtudesData] = useState<EtudesData>({
    pasCommencees: [],
    enCours: [],
    terminees: [],
  })
  const [error, setError] = useState<string | null>(null)

  useFocusEffect(
    useCallback(() => {
      const fetchEtudes = async () => {
        try {
          setLoading(true)
          setError(null)

          // Essayer d'abord avec un endpoint admin spécifique, sinon utiliser l'endpoint normal
          let response
          try {
            response = await api.get("/etude/admin") // Nouvel endpoint pour l'admin
          } catch (adminError) {
            console.log("Endpoint admin non disponible, utilisation de l'endpoint normal")
            response = await api.get("/etude/") // Fallback sur l'endpoint normal
          }

          const rawEtudes = response.data

          console.log("Données brutes récupérées:", rawEtudes)
          console.log("Nombre d'études:", rawEtudes.length)

          // Transformer les données
          const formattedEtudes: Etude[] = rawEtudes
            .map((etude: any) => {
              console.log(`Étude ${etude.Id_etude}: statut = ${etude.ID_statutE}`)
              return {
                id: etude.Id_etude?.toString() || `etude-${Math.random()}`,
                titre: etude.titre_etude ?? "Titre manquant",
                description: etude.description_etude ?? "Pas de description",
                type: etude.categorie ?? "Autre",
                prix: etude.prix_etude ?? 0,
                nbrIntervenant: etude.nbrIntervenant ?? 1,
                dateDebut: etude.dateDebut_etude ?? "",
                dateFin: etude.dateFin_etude ?? "",
                image: etude.img_etude
                  ? etude.img_etude.startsWith("http")
                    ? etude.img_etude
                    : `https://votre-domaine.com/images/${etude.img_etude}`
                  : "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=200&fit=crop",
                statut: etude.ID_statutE ?? 3,
              }
            })
            // Filtrer les études supprimées (statut 4)
            .filter((etude: { statut: number }) => etude.statut !== 4)

          console.log("Études formatées (sans les supprimées):", formattedEtudes)

          // Grouper par statut
          // Statut 3 = Pas commencée, 1 = En cours, 2 = Terminée, 4 = Supprimée (filtrée)
          const grouped: EtudesData = {
            pasCommencees: formattedEtudes.filter((etude) => etude.statut === 3),
            enCours: formattedEtudes.filter((etude) => etude.statut === 1),
            terminees: formattedEtudes.filter((etude) => etude.statut === 2),
          }

          console.log("Groupement par statut:")
          console.log("Pas commencées:", grouped.pasCommencees.length)
          console.log("En cours:", grouped.enCours.length)
          console.log("Terminées:", grouped.terminees.length)

          setEtudesData(grouped)
        } catch (err) {
          console.error("Erreur récupération études:", err)
          setError("Erreur lors du chargement des études")
          setEtudesData({
            pasCommencees: [],
            enCours: [],
            terminees: [],
          })
        } finally {
          setLoading(false)
        }
      }

      fetchEtudes()
    }, []),
  )

  const handleEtudePress = (etude: Etude) => {
    router.push({
      pathname: "/(tabs)/etudeadmin/detail_etude_admin",
      params: { etudeData: JSON.stringify(etude) },
    })
  }

  const renderEtudesList = (etudes: Etude[], title: string, delay: number) => (
    <Animated.View entering={FadeInDown.delay(delay)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionCount}>{etudes.length}</Text>
      </View>
      {etudes.length > 0 ? (
        <FlatList
          data={etudes}
          renderItem={({ item }) => <EtudeCard etude={item} onPress={() => handleEtudePress(item)} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        />
      ) : (
        <View style={styles.emptySection}>
          <Text style={styles.emptyText}>Aucune étude dans cette catégorie</Text>
        </View>
      )}
    </Animated.View>
  )

  const totalEtudes = etudesData.pasCommencees.length + etudesData.enCours.length + etudesData.terminees.length

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Gestion des Études</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/(tabs)/etudeadmin/creer-etude")}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerLine} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Chargement des études...</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Gestion des Études</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/(tabs)/etudeadmin/creer-etude")}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerLine} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header unifié */}
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Gestion des Études</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/(tabs)/etudeadmin/creer-etude")}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerLine} />
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Statistiques */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalEtudes}</Text>
              <Text style={styles.statLabel}>Total Études</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{etudesData.enCours.length}</Text>
              <Text style={styles.statLabel}>En Cours</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{etudesData.terminees.length}</Text>
              <Text style={styles.statLabel}>Terminées</Text>
            </View>
          </Animated.View>

          {/* Sections des études */}
          {renderEtudesList(etudesData.pasCommencees, "Pas commencées", 200)}
          {renderEtudesList(etudesData.enCours, "En cours", 300)}
          {renderEtudesList(etudesData.terminees, "Terminées", 400)}
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
  retryButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  headerContainer: {
    paddingTop: 28, // ou utilisez useSafeAreaInsets si vous préférez
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#F8FAFC",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E293B",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  headerLine: {
    height: 2,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 40,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: "auto",
    marginRight: 20,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  sectionCount: {
    fontSize: 16,
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  emptySection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
  etudeCard: {
    width: cardWidth,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  etudeImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#F1F5F9",
  },
  etudeContent: {
    padding: 16,
  },
  etudeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  etudeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    marginRight: 8,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  etudeDescription: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 12,
    lineHeight: 20,
  },
  etudeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  etudeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  etudeInfoText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 4,
  },
  etudePrix: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10B981",
  },
})

export default EtudesAdminScreen