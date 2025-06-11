"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import {
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

import FooterLogo from "@/components/FooterLogo"

const { width } = Dimensions.get("window")

const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    "IT & Digital": "#3B82F6",
    "Ingénierie des systèmes": "#10B981",
    "Conseil": "#8B5CF6",
    "RSE": "#F59E0B",
    "Digital & Culture": "#EF4444",
    "Traduction Technique": "#06B6D4"
  }
  return colors[type] || "#64748B"
}

const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    "Pas commencée": "#64748B",
    "En cours": "#F59E0B",
    "Terminée": "#10B981"
  }
  return colors[status] || "#64748B"
}

const DetailEtudeAdminScreen = () => {
  const router = useRouter()
  const { etudeData } = useLocalSearchParams()
  
  // Données fictives enrichies avec statut et date de création
  const etude = etudeData ? {
    ...JSON.parse(etudeData as string),
    statut: "En cours", // Ajout du statut
    dateCreation: "2024-01-10" // Ajout de la date de création
  } : null

  if (!etude) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Erreur: Données de l'étude non trouvées</Text>
      </SafeAreaView>
    )
  }

  const handleDeleteEtude = () => {
    Alert.alert(
      "Supprimer l'étude",
      "Êtes-vous sûr de vouloir supprimer cette étude ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => {
            Alert.alert("Succès", "L'étude a été supprimée", [
              { text: "OK", onPress: () => router.back() }
            ])
          }
        }
      ]
    )
  }

  const handleEditEtude = () => {
    router.push({
      pathname: '/(tabs)/etudeadmin/modifier-etude',
      params: { etudeData: JSON.stringify(etude) }
    })
  }

  const handleManageIntervenants = () => {
    router.push({
      pathname: '/(tabs)/etudeadmin/gerer-intervenants',
      params: { etudeData: JSON.stringify(etude) }
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail de l'Étude</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditEtude}
          activeOpacity={0.7}
        >
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
              <View style={[styles.statusTag, { backgroundColor: getStatusColor(etude.statut) }]}>
                <Text style={styles.statusText}>{etude.statut}</Text>
              </View>
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
            <Text style={styles.sectionTitle}>Détails de l'étude</Text>
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="information-circle-outline" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Statut</Text>
                <Text style={[styles.detailValue, { color: getStatusColor(etude.statut) }]}>
                  {etude.statut}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="time-outline" size={20} color="#06B6D4" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date de création</Text>
                <Text style={styles.detailValue}>
                  {new Date(etude.dateCreation).toLocaleDateString()}
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
                  Du {new Date(etude.dateDebut).toLocaleDateString()} au {new Date(etude.dateFin).toLocaleDateString()}
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
              <Text style={[styles.actionButtonText, { color: "#3B82F6" }]}>Modifier l'étude</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleManageIntervenants}>
              <Ionicons name="people-outline" size={20} color="#10B981" />
              <Text style={[styles.actionButtonText, { color: "#10B981" }]}>Gérer les intervenants</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text-outline" size={20} color="#8B5CF6" />
              <Text style={[styles.actionButtonText, { color: "#8B5CF6" }]}>Voir les rapports</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleDeleteEtude}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={[styles.actionButtonText, { color: "#EF4444" }]}>Supprimer l'étude</Text>
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