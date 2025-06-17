"use client"

import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import {
  Dimensions,
  DimensionValue,
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

const DetailEtudeScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()

  const {
    id,
    title,
    description,
    image,
    type,
    // Paramètres spécifiques selon le type
    status,
    appliedDate,
    duration,
    level,
    statusColor,
    progress,
    nextSession,
    modulesCompleted,
    modulesTotal,
    color,
    completedDate,
    grade,
    certificate,
    skills
  } = params

  // Conversion des paramètres pour éviter les erreurs TypeScript
  const progressValue = progress ? parseInt(progress as string, 10) : 0
  const parsedSkills = skills ? JSON.parse(skills as string) : []
  const isCertificate = certificate === 'true'

  // Fonction pour calculer la largeur de la barre de progression
  const getProgressWidth = (progressPercent: number): DimensionValue => {
    return `${Math.min(Math.max(progressPercent, 0), 100)}%` as DimensionValue
  }

  const renderPostuleeContent = () => (
    <View style={styles.detailsContainer}>
      <View style={[styles.statusCard, { backgroundColor: `${statusColor}15` }]}>
        <View style={[styles.statusDot, { backgroundColor: statusColor as string }]} />
        <Text style={[styles.statusText, { color: statusColor as string }]}>
          {status}
        </Text>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Informations</Text>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={20} color="#64748B" />
          <Text style={styles.infoText}>Postulé le {appliedDate}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={20} color="#64748B" />
          <Text style={styles.infoText}>Durée: {duration}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="bar-chart-outline" size={20} color="#64748B" />
          <Text style={styles.infoText}>Niveau: {level}</Text>
        </View>
      </View>
    </View>
  )

  const renderEnCoursContent = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Progression</Text>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressPercent, { color: color as string }]}>
            {progressValue}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: getProgressWidth(progressValue),
                backgroundColor: color as string
              }
            ]} 
          />
        </View>
        <Text style={styles.modulesText}>
          {modulesCompleted}/{modulesTotal} modules terminés
        </Text>
      </View>

      <View style={styles.sessionCard}>
        <Text style={styles.sessionTitle}>Prochaine session</Text>
        <View style={styles.sessionInfo}>
          <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
          <Text style={styles.sessionText}>{nextSession}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.actionButton, { backgroundColor: color as string }]}>
        <Text style={styles.actionButtonText}>Continuer la formation</Text>
      </TouchableOpacity>
    </View>
  )

  const renderTermineeContent = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.gradeCard}>
        <Text style={styles.gradeTitle}>Note obtenue</Text>
        <View style={styles.gradeDisplay}>
          <View style={[styles.gradeCircle, { backgroundColor: color as string }]}>
            <Text style={styles.gradeText}>{grade}</Text>
          </View>
          <Text style={styles.completedText}>Terminé le {completedDate}</Text>
        </View>
      </View>

      {parsedSkills.length > 0 && (
        <View style={styles.skillsCard}>
          <Text style={styles.skillsTitle}>Compétences acquises</Text>
          <View style={styles.skillsList}>
            {parsedSkills.map((skill: string, index: number) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.certificateCard}>
        <View style={styles.certificateInfo}>
          <Ionicons 
            name={isCertificate ? "document-text" : "document-text-outline"} 
            size={24} 
            color={isCertificate ? "#10B981" : "#94A3B8"} 
          />
          <Text style={[
            styles.certificateText, 
            { color: isCertificate ? "#10B981" : "#94A3B8" }
          ]}>
            {isCertificate ? "Certificat disponible" : "Pas de certificat"}
          </Text>
        </View>
        {isCertificate && (
          <TouchableOpacity style={styles.downloadButton}>
            <Text style={styles.downloadButtonText}>Télécharger</Text>
            <Ionicons name="download-outline" size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

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
        <Text style={styles.headerTitle}>Détail de l&apos;étude</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(100)}>
          <Image source={{ uri: image as string }} style={styles.heroImage} />
        </Animated.View>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200)}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)}>
            {type === 'postulée' && renderPostuleeContent()}
            {type === 'enCours' && renderEnCoursContent()}
            {type === 'terminée' && renderTermineeContent()}
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
  },
  heroImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsContainer: {
    gap: 20,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#64748B",
  },
  progressCard: {
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
  },
  progressHeader: {
    alignItems: "center",
    marginBottom: 12,
  },
  progressPercent: {
    fontSize: 32,
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  modulesText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  sessionCard: {
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 16,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
  sessionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sessionText: {
    fontSize: 16,
    color: "#64748B",
  },
  gradeCard: {
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 16,
  },
  gradeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
  },
  gradeDisplay: {
    alignItems: "center",
    gap: 12,
  },
  gradeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  gradeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  completedText: {
    fontSize: 14,
    color: "#64748B",
  },
  skillsCard: {
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 16,
  },
  skillsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
  },
  certificateCard: {
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  certificateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  certificateText: {
    fontSize: 16,
    fontWeight: "500",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default DetailEtudeScreen