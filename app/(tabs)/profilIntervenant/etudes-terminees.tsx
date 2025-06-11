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

// Données fictives pour les études terminées
const completedStudies = [
  {
    id: "1",
    title: "Bases de Données Avancées",
    description: "Maîtrise des systèmes de gestion de bases de données relationnelles et NoSQL",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=200&fit=crop",
    completedDate: "20 Déc 2023",
    grade: "A",
    certificate: true,
    skills: ["SQL", "NoSQL", "MongoDB", "PostgreSQL"],
    color: "#10B981",
    type: "terminée"
  },
  {
    id: "2",
    title: "Gestion de Projet Agile",
    description: "Méthodes agiles et gestion d'équipe dans l'environnement digital",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
    completedDate: "15 Nov 2023",
    grade: "B+",
    certificate: true,
    skills: ["Scrum", "Kanban", "Leadership", "Communication"],
    color: "#8B5CF6",
    type: "terminée"
  },
  {
    id: "3",
    title: "Marketing Digital",
    description: "Stratégies de marketing en ligne et optimisation des conversions",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    completedDate: "30 Oct 2023",
    grade: "A-",
    certificate: false,
    skills: ["SEO", "SEM", "Social Media", "Analytics"],
    color: "#F59E0B",
    type: "terminée"
  }
]

const EtudesTermineesScreen = () => {
  const router = useRouter()

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "#10B981"
    if (grade.startsWith("B")) return "#3B82F6"
    if (grade.startsWith("C")) return "#F59E0B"
    return "#EF4444"
  }

  const handleStudyPress = (study: any) => {
    router.push({
      pathname: '/(tabs)/profilIntervenant/detail_etude',
      params: {
        id: study.id,
        title: study.title,
        description: study.description,
        image: study.image,
        completedDate: study.completedDate,
        grade: study.grade,
        certificate: study.certificate.toString(),
        skills: JSON.stringify(study.skills),
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
        <Text style={styles.headerTitle}>Études terminées</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          
          {/* Stats */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedStudies.length}</Text>
              <Text style={styles.statLabel}>Formations terminées</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {completedStudies.filter(s => s.certificate).length}
              </Text>
              <Text style={styles.statLabel}>Certificats</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {completedStudies.reduce((acc, study) => acc + study.skills.length, 0)}
              </Text>
              <Text style={styles.statLabel}>Compétences</Text>
            </View>
          </Animated.View>

          {/* Liste des études */}
          <View style={styles.studiesContainer}>
            {completedStudies.map((study, index) => (
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
                    <View style={styles.studyHeader}>
                      <View style={styles.studyTitleContainer}>
                        <Text style={styles.studyTitle}>{study.title}</Text>
                        <Text style={styles.completedDate}>Terminé le {study.completedDate}</Text>
                      </View>
                      <View style={[styles.gradeCircle, { backgroundColor: getGradeColor(study.grade) }]}>
                        <Text style={styles.gradeText}>{study.grade}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.studyDescription}>{study.description}</Text>
                    
                    {/* Compétences acquises */}
                    <View style={styles.skillsContainer}>
                      <Text style={styles.skillsTitle}>Compétences acquises</Text>
                      <View style={styles.skillsList}>
                        {study.skills.map((skill, skillIndex) => (
                          <View key={skillIndex} style={styles.skillBadge}>
                            <Text style={styles.skillText}>{skill}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Certificat */}
                    <View style={styles.certificateContainer}>
                      <View style={styles.certificateInfo}>
                        <Ionicons 
                          name={study.certificate ? "document-text" : "document-text-outline"} 
                          size={20} 
                          color={study.certificate ? "#10B981" : "#94A3B8"} 
                        />
                        <Text style={[
                          styles.certificateText, 
                          { color: study.certificate ? "#10B981" : "#94A3B8" }
                        ]}>
                          {study.certificate ? "Certificat disponible" : "Pas de certificat"}
                        </Text>
                      </View>
                      {study.certificate && (
                        <TouchableOpacity style={styles.downloadButton}>
                          <Text style={styles.downloadButtonText}>Télécharger</Text>
                        </TouchableOpacity>
                      )}
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
  studyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  studyTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  studyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  completedDate: {
    fontSize: 12,
    color: "#94A3B8",
  },
  gradeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  gradeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  studyDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 20,
  },
  skillsContainer: {
    marginBottom: 20,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E293B",
    marginBottom: 12,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  certificateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  certificateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  certificateText: {
    fontSize: 14,
    fontWeight: "500",
  },
  downloadButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
})

export default EtudesTermineesScreen