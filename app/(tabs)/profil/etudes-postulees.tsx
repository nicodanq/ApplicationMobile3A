"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import {
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
import Animated, { FadeInDown } from "react-native-reanimated"

import FooterLogo from "@/components/FooterLogo"

const { width } = Dimensions.get("window")

// Données fictives pour les études postulées
const postuledStudies = [
  {
    id: "1",
    title: "Intelligence Artificielle Avancée",
    description: "Formation complète sur l'IA et le machine learning avec Python et TensorFlow",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
    status: "En attente",
    appliedDate: "15 Jan 2024",
    duration: "6 mois",
    level: "Avancé",
    statusColor: "#F59E0B",
    type: "postulée"
  },
  {
    id: "2",
    title: "Cybersécurité Éthique",
    description: "Apprenez les techniques de hacking éthique et de protection des systèmes",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop",
    status: "En cours d'évaluation",
    appliedDate: "10 Jan 2024",
    duration: "4 mois",
    level: "Intermédiaire",
    statusColor: "#3B82F6",
    type: "postulée"
  },
  {
    id: "3",
    title: "Data Science & Analytics",
    description: "Maîtrisez l'analyse de données et la visualisation avec R et Python",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    status: "Dossier incomplet",
    appliedDate: "5 Jan 2024",
    duration: "5 mois",
    level: "Intermédiaire",
    statusColor: "#EF4444",
    type: "postulée"
  }
]

const EtudesPostuleesScreen = () => {
  const router = useRouter()

  const handleStudyPress = (study: any) => {
    router.push({
      pathname: '/profil/detail_etude',
      params: {
        id: study.id,
        title: study.title,
        description: study.description,
        image: study.image,
        status: study.status,
        appliedDate: study.appliedDate,
        duration: study.duration,
        level: study.level,
        statusColor: study.statusColor,
        type: study.type
      }
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
        <Text style={styles.headerTitle}>Études postulées</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          
          {/* Stats */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{postuledStudies.length}</Text>
              <Text style={styles.statLabel}>Candidatures</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {postuledStudies.filter(s => s.status === "En attente").length}
              </Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {postuledStudies.filter(s => s.status === "En cours d'évaluation").length}
              </Text>
              <Text style={styles.statLabel}>En évaluation</Text>
            </View>
          </Animated.View>

          {/* Liste des études */}
          <View style={styles.studiesContainer}>
            {postuledStudies.map((study, index) => (
              <Animated.View
                key={study.id}
                entering={FadeInDown.delay(200 + index * 100)}
                style={styles.studyCard}
              >
                <TouchableOpacity
                  onPress={() => handleStudyPress(study)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: study.image }} style={styles.studyImage} />
                  
                  <View style={styles.studyContent}>
                    <Text style={styles.studyTitle}>{study.title}</Text>
                    <Text style={styles.studyDescription}>{study.description}</Text>
                    
                    <View style={styles.studyMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={16} color="#64748B" />
                        <Text style={styles.metaText}>{study.duration}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="bar-chart-outline" size={16} color="#64748B" />
                        <Text style={styles.metaText}>{study.level}</Text>
                      </View>
                    </View>

                    <View style={styles.studyFooter}>
                      <View style={[styles.statusBadge, { backgroundColor: `${study.statusColor}15` }]}>
                        <View style={[styles.statusDot, { backgroundColor: study.statusColor }]} />
                        <Text style={[styles.statusText, { color: study.statusColor }]}>
                          {study.status}
                        </Text>
                      </View>
                      <Text style={styles.appliedDate}>Postulé le {study.appliedDate}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
  },
  studiesContainer: {
    gap: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  studyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  studyImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  studyContent: {
    padding: 20,
  },
  studyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  studyDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 16,
  },
  studyMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#64748B",
  },
  studyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  appliedDate: {
    fontSize: 12,
    color: "#94A3B8",
  },
})

export default EtudesPostuleesScreen