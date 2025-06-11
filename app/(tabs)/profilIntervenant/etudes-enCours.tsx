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

// Données fictives pour les études en cours
const currentStudies = [
  {
    id: "1",
    title: "Développement Web Full-Stack",
    description: "Formation complète en développement web moderne avec React, Node.js et bases de données",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop",
    progress: 65,
    nextSession: "Lundi 22 Jan - 14h00",
    modules: { completed: 8, total: 12 },
    color: "#10B981",
    type: "enCours"
  },
  {
    id: "2",
    title: "Gestion de Projet Digital",
    description: "Maîtrisez les outils et méthodes de gestion de projet dans l'environnement digital",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
    progress: 30,
    nextSession: "Mercredi 24 Jan - 10h00",
    modules: { completed: 3, total: 10 },
    color: "#8B5CF6",
    type: "enCours"
  }
]

const EtudesEnCoursScreen = () => {
  const router = useRouter()

  const handleStudyPress = (study: any) => {
    router.push({
      pathname: '/(tabs)/profilIntervenant/detail_etude',
      params: {
        id: study.id,
        title: study.title,
        description: study.description,
        image: study.image,
        progress: study.progress.toString(),
        nextSession: study.nextSession,
        modulesCompleted: study.modules.completed.toString(),
        modulesTotal: study.modules.total.toString(),
        color: study.color,
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
        <Text style={styles.headerTitle}>Études en cours</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          
          {/* Stats */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentStudies.length}</Text>
              <Text style={styles.statLabel}>Formations actives</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {Math.round(currentStudies.reduce((acc, study) => acc + study.progress, 0) / currentStudies.length)}%
              </Text>
              <Text style={styles.statLabel}>Progression</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {currentStudies.reduce((acc, study) => acc + study.modules.completed, 0)}
              </Text>
              <Text style={styles.statLabel}>Modules terminés</Text>
            </View>
          </Animated.View>

          {/* Liste des études */}
          <View style={styles.studiesContainer}>
            {currentStudies.map((study, index) => (
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
                    
                    {/* Barre de progression */}
                    <View style={styles.progressContainer}>
                      <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Progression</Text>
                        <Text style={[styles.progressPercent, { color: study.color }]}>
                          {study.progress}%
                        </Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { 
                              width: `${study.progress}%`,
                              backgroundColor: study.color
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.modulesText}>
                        {study.modules.completed}/{study.modules.total} modules terminés
                      </Text>
                    </View>

                    {/* Prochaine session */}
                    <View style={styles.nextSessionContainer}>
                      <View style={styles.sessionIcon}>
                        <Ionicons name="calendar-outline" size={16} color="#3B82F6" />
                      </View>
                      <View>
                        <Text style={styles.sessionLabel}>Prochaine session</Text>
                        <Text style={styles.sessionText}>{study.nextSession}</Text>
                      </View>
                    </View>

                    <TouchableOpacity style={[styles.continueButton, { backgroundColor: study.color }]}>
                      <Text style={styles.continueButtonText}>Continuer</Text>
                    </TouchableOpacity>
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
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  modulesText: {
    fontSize: 12,
    color: "#94A3B8",
  },
  nextSessionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  sessionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  sessionLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 2,
  },
  sessionText: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
  },
  continueButton: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default EtudesEnCoursScreen