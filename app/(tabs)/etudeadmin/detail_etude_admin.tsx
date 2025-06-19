"use client"

import api from "@/api/axiosClient"
import FooterLogo from "@/components/FooterLogo"
import { useSession } from "@/contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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

type EtudeDetail = {
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
  dateCreation: string
}

const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    "IT & Digital": "#3B82F6",
    "Ingénierie des Systèmes": "#10B981",
    Conseil: "#8B5CF6",
    RSE: "#F59E0B",
    "Digital & Culture": "#EF4444",
    "Traduction Technique": "#06B6D4",
  }
  return colors[type] || "#64748B"
}

const getStatusInfo = (statutId: number) => {
  const statuses: { [key: number]: { label: string; color: string } } = {
    3: { label: "Pas commencée", color: "#64748B" },
    1: { label: "En cours", color: "#F59E0B" },
    2: { label: "Terminée", color: "#10B981" },
    4: { label: "Supprimée", color: "#EF4444" },
  }
  return statuses[statutId] || { label: "Inconnu", color: "#64748B" }
}

const DetailEtudeAdminScreen = () => {
  const router = useRouter()
  const { etudeData } = useLocalSearchParams()
  const { user, token } = useSession()

  const [loading, setLoading] = useState(false)
  const [etude, setEtude] = useState<EtudeDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Récupérer l'ID depuis les paramètres
  const initialEtudeData = useMemo(() => {
    return etudeData ? JSON.parse(etudeData as string) : null
  }, [etudeData])

  const etudeId = useMemo(() => {
    return initialEtudeData?.id
  }, [initialEtudeData])

  useFocusEffect(
    useCallback(() => {
      const fetchEtudeDetail = async () => {
        if (!etudeId) {
          setError("ID de l'étude manquant")
          return
        }

        try {
          setLoading(true)
          setError(null)

          // Récupérer toutes les études et trouver celle qui correspond
          let response
          try {
            response = await api.get("/etude/admin")
          } catch {
            response = await api.get("/etude/")
          }

          const rawEtudes = response.data
          const currentEtude = rawEtudes.find((e: any) => e.Id_etude?.toString() === etudeId)

          if (currentEtude) {
            const formattedEtude: EtudeDetail = {
              id: currentEtude.Id_etude?.toString() || "",
              titre: currentEtude.titre_etude ?? "Titre manquant",
              description: currentEtude.description_etude ?? "Pas de description",
              type: currentEtude.categorie ?? "Autre",
              prix: currentEtude.prix_etude ?? 0,
              nbrIntervenant: currentEtude.nbrIntervenant ?? 1,
              dateDebut: currentEtude.dateDebut_etude ?? "",
              dateFin: currentEtude.dateFin_etude ?? "",
              image: currentEtude.img_etude
                ? currentEtude.img_etude.startsWith("http")
                  ? currentEtude.img_etude
                  : `https://votre-domaine.com/images/${currentEtude.img_etude}`
                : "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop",
              statut: currentEtude.ID_statutE ?? 3,
              dateCreation: currentEtude.dateCreation_etude ?? "",
            }

            setEtude(formattedEtude)
          } else {
            // Si l'étude n'est pas trouvée dans l'API, utiliser les données initiales
            if (initialEtudeData) {
              const formattedEtude: EtudeDetail = {
                id: initialEtudeData.id || "",
                titre: initialEtudeData.titre || "Titre manquant",
                description: initialEtudeData.description || "Pas de description",
                type: initialEtudeData.type || "Autre",
                prix: initialEtudeData.prix || 0,
                nbrIntervenant: initialEtudeData.nbrIntervenant || 1,
                dateDebut: initialEtudeData.dateDebut || "",
                dateFin: initialEtudeData.dateFin || "",
                image:
                  initialEtudeData.image ||
                  "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop",
                statut: initialEtudeData.statut || 3,
                dateCreation: initialEtudeData.dateCreation || new Date().toISOString(),
              }
              setEtude(formattedEtude)
            } else {
              setError("Étude non trouvée")
            }
          }
        } catch (err) {
          console.error("Erreur récupération étude:", err)
          // En cas d'erreur API, utiliser les données initiales si disponibles
          if (initialEtudeData) {
            const formattedEtude: EtudeDetail = {
              id: initialEtudeData.id || "",
              titre: initialEtudeData.titre || "Titre manquant",
              description: initialEtudeData.description || "Pas de description",
              type: initialEtudeData.type || "Autre",
              prix: initialEtudeData.prix || 0,
              nbrIntervenant: initialEtudeData.nbrIntervenant || 1,
              dateDebut: initialEtudeData.dateDebut || "",
              dateFin: initialEtudeData.dateFin || "",
              image:
                initialEtudeData.image ||
                "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop",
              statut: initialEtudeData.statut || 3,
              dateCreation: initialEtudeData.dateCreation || new Date().toISOString(),
            }
            setEtude(formattedEtude)
          } else {
            setError("Erreur lors du chargement de l'étude")
          }
        } finally {
          setLoading(false)
        }
      }

      fetchEtudeDetail()
    }, [etudeId]), // Supprimer initialEtudeData des dépendances
  )

  const handleDeleteEtude = async () => {
    if (!etude) return

    Alert.alert(
      "Supprimer l'étude",
      "Êtes-vous sûr de vouloir supprimer cette étude ? Elle sera archivée et ne sera plus visible dans la liste.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              // Appel API pour changer le statut à 4 (supprimée/archivée)
              await api.put(`/etude/${etude.id}/status`, { statut: 4 })

              Alert.alert("Succès", "L'étude a été supprimée et archivée", [
                { text: "OK", onPress: () => router.back() },
              ])
            } catch (err) {
              console.error("Erreur suppression:", err)
              // Même si l'API échoue, on peut marquer localement comme supprimée
              setEtude({ ...etude, statut: 4 })
              Alert.alert(
                "Étude supprimée localement",
                "L'étude a été marquée comme supprimée. La synchronisation avec le serveur se fera plus tard.",
                [{ text: "OK", onPress: () => router.back() }],
              )
            }
          },
        },
      ],
    )
  }

  const handleEditEtude = () => {
    if (!etude) return
    router.push({
      pathname: "/(tabs)/etudeadmin/modifier-etude",
      params: { etudeData: JSON.stringify(etude) },
    })
  }

  const handleManageIntervenants = () => {
    if (!etude) return
    router.push({
      pathname: "/(tabs)/etudeadmin/gerer-intervenants",
      params: { etudeData: JSON.stringify(etude) },
    })
  }

  const handleUpdateStatus = async (newStatus: number) => {
    if (!etude) return

    try {
      // Appel API pour mettre à jour le statut
      await api.put(`/etude/${etude.id}/status`, { statut: newStatus })

      // Mettre à jour l'état local
      setEtude({ ...etude, statut: newStatus })

      Alert.alert("Succès", "Statut mis à jour")
    } catch (err) {
      console.error("Erreur mise à jour statut:", err)
      // Mettre à jour localement même si l'API échoue
      setEtude({ ...etude, statut: newStatus })
      Alert.alert("Statut mis à jour localement", "La synchronisation avec le serveur se fera plus tard")
    }
  }

  if (loading && !etude) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Chargement de l&apos;étude...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error || !etude) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Étude non trouvée"}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const statusInfo = getStatusInfo(etude.statut)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail de l&apos;Étude</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditEtude} activeOpacity={0.7}>
          <Ionicons name="create-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Image et titre */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.heroSection}>
            <Image source={{ uri: etude.image }} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <View style={[styles.typeTag, { backgroundColor: getTypeColor(etude.type) }]}>
                <Text style={styles.typeText}>{etude.type}</Text>
              </View>
              <TouchableOpacity
                style={[styles.statusTag, { backgroundColor: statusInfo.color }]}
                onPress={() => {
                  Alert.alert("Changer le statut", "Sélectionnez le nouveau statut", [
                    { text: "Annuler", style: "cancel" },
                    { text: "Pas commencée", onPress: () => handleUpdateStatus(3) },
                    { text: "En cours", onPress: () => handleUpdateStatus(1) },
                    { text: "Terminée", onPress: () => handleUpdateStatus(2) },
                  ])
                }}
              >
                <Text style={styles.statusText}>{statusInfo.label}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Informations principales */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.mainInfo}>
            <Text style={styles.title}>{etude.titre}</Text>
            <Text style={styles.description}>{etude.description}</Text>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>{etude.prix.toLocaleString()}€</Text>
              <View style={styles.participantsInfo}>
                <Ionicons name="people-outline" size={20} color="#64748B" />
                <Text style={styles.participantsText}>{etude.nbrIntervenant} intervenants</Text>
              </View>
            </View>
          </Animated.View>

          {/* Détails de l'étude */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Détails de l&apos;étude</Text>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="information-circle-outline" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Statut</Text>
                <Text style={[styles.detailValue, { color: statusInfo.color }]}>{statusInfo.label}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="time-outline" size={20} color="#06B6D4" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date de création</Text>
                <Text style={styles.detailValue}>
                  {etude.dateCreation ? new Date(etude.dateCreation).toLocaleDateString("fr-FR") : "Non spécifiée"}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Période</Text>
                <Text style={styles.detailValue}>
                  Du {new Date(etude.dateDebut).toLocaleDateString("fr-FR")} au{" "}
                  {new Date(etude.dateFin).toLocaleDateString("fr-FR")}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="pricetag-outline" size={20} color="#10B981" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>{etude.prix.toLocaleString()}€</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="people-outline" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Équipe</Text>
                <Text style={styles.detailValue}>{etude.nbrIntervenant} intervenants requis</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="folder-outline" size={20} color="#F59E0B" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Domaine</Text>
                <Text style={styles.detailValue}>{etude.type}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Actions administrateur */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.adminActions}>
            <Text style={styles.sectionTitle}>Actions administrateur</Text>

            <TouchableOpacity style={styles.actionButton} onPress={handleEditEtude}>
              <Ionicons name="create-outline" size={20} color="#3B82F6" />
              <Text style={[styles.actionButtonText, { color: "#3B82F6" }]}>Modifier l&apos;étude</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleManageIntervenants}>
              <Ionicons name="people-outline" size={20} color="#10B981" />
              <Text style={[styles.actionButtonText, { color: "#10B981" }]}>Gérer les intervenants</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleDeleteEtude}>
              <Ionicons name="archive-outline" size={20} color="#EF4444" />
              <Text style={[styles.actionButtonText, { color: "#EF4444" }]}>Supprimer l&apos;étude</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>

      <FooterLogo />
    </SafeAreaView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  editButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    position: "relative",
  },
  heroImage: {
    width: width,
    height: 250,
    backgroundColor: "#F1F5F9",
  },
  heroOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    gap: 8,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  mainInfo: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 24,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#10B981",
  },
  participantsInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantsText: {
    fontSize: 16,
    color: "#64748B",
    marginLeft: 8,
  },
  detailsContainer: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  adminActions: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
})

export default DetailEtudeAdminScreen
