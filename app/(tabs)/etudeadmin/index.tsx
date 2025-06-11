"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import {
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

import FooterLogo from "@/components/FooterLogo"
import HeaderPage from "@/components/HeaderPage"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.75

// Données fictives pour les études
const etudesData = {
  pasCommencees: [
    {
      id: 1,
      titre: "Développement Mobile React Native",
      description: "Application mobile complète",
      type: "IT & Digital",
      prix: 15000,
      nbrIntervenant: 3,
      dateDebut: "2024-02-01",
      dateFin: "2024-04-30",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      titre: "Audit Système Industriel",
      description: "Analyse complète des systèmes",
      type: "Ingénierie des systèmes",
      prix: 25000,
      nbrIntervenant: 5,
      dateDebut: "2024-02-15",
      dateFin: "2024-05-15",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop"
    }
  ],
  enCours: [
    {
      id: 3,
      titre: "Stratégie Digital Marketing",
      description: "Transformation digitale complète",
      type: "Digital & Culture",
      prix: 18000,
      nbrIntervenant: 4,
      dateDebut: "2024-01-15",
      dateFin: "2024-03-15",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      titre: "Conseil en RSE",
      description: "Mise en place politique RSE",
      type: "RSE",
      prix: 12000,
      nbrIntervenant: 2,
      dateDebut: "2024-01-01",
      dateFin: "2024-02-28",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=200&fit=crop"
    }
  ],
  terminees: [
    {
      id: 5,
      titre: "Traduction Documentation Technique",
      description: "Traduction multilingue",
      type: "Traduction Technique",
      prix: 8000,
      nbrIntervenant: 3,
      dateDebut: "2023-11-01",
      dateFin: "2023-12-31",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop"
    },
    {
      id: 6,
      titre: "Audit Conseil Stratégique",
      description: "Optimisation processus",
      type: "Conseil",
      prix: 22000,
      nbrIntervenant: 4,
      dateDebut: "2023-10-01",
      dateFin: "2023-12-15",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop"
    }
  ]
}

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

const EtudeCard = ({ etude, onPress }: { etude: any, onPress: () => void }) => (
  <TouchableOpacity style={styles.etudeCard} onPress={onPress} activeOpacity={0.7}>
    <Image source={{ uri: etude.image }} style={styles.etudeImage} />
    <View style={styles.etudeContent}>
      <View style={styles.etudeHeader}>
        <Text style={styles.etudeTitle} numberOfLines={2}>{etude.titre}</Text>
        <View style={[styles.typeTag, { backgroundColor: getTypeColor(etude.type) }]}>
          <Text style={styles.typeText}>{etude.type}</Text>
        </View>
      </View>
      <Text style={styles.etudeDescription} numberOfLines={2}>{etude.description}</Text>
      <View style={styles.etudeFooter}>
        <View style={styles.etudeInfo}>
          <Ionicons name="people-outline" size={16} color="#64748B" />
          <Text style={styles.etudeInfoText}>{etude.nbrIntervenant} intervenants</Text>
        </View>
        <Text style={styles.etudePrix}>{etude.prix.toLocaleString()}€</Text>
      </View>
    </View>
  </TouchableOpacity>
)

const EtudesAdminScreen = () => {
  const router = useRouter()

  const handleEtudePress = (etude: any) => {
    router.push({
      pathname: '/(tabs)/etudeadmin/detail_etude_admin',
      params: { etudeData: JSON.stringify(etude) }
    })
  }

  const renderEtudesList = (etudes: any[], title: string, delay: number) => (
    <Animated.View entering={FadeInDown.delay(delay)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionCount}>{etudes.length}</Text>
      </View>
      <FlatList
        data={etudes}
        renderItem={({ item }) => (
          <EtudeCard etude={item} onPress={() => handleEtudePress(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      />
    </Animated.View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <HeaderPage title = "Gestion des Études"/>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/etudeadmin/creer-etude')}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          
          {/* Statistiques */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {etudesData.pasCommencees.length + etudesData.enCours.length + etudesData.terminees.length}
              </Text>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
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