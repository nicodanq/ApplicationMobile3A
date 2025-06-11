"use client"

import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"

import FooterLogo from "@/components/FooterLogo"
import { useLocalSearchParams, useRouter } from "expo-router"

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

// Type pour les informations additionnelles
type AdditionalInfo = {
  period: string;
  funding: string;
  participants: string;
  publicationDate: string;
  description: string;
  team: Array<{
    id: number;
    name: string;
    role: string;
  }>;
}

// Données fictives pour compléter les informations manquantes
const additionalInfo: Record<string, AdditionalInfo> = {
  "1": {
    period: "15 Sept - 15 Mars 2024",
    funding: "18 000 €",
    participants: "3 développeurs",
    publicationDate: "5 juin 2023",
    description: "Cette formation complète en développement web moderne couvre les technologies front-end et back-end les plus demandées sur le marché. Vous apprendrez React, Node.js et les bases de données SQL et NoSQL pour devenir un développeur full-stack compétent.",
    team: [
      { id: 1, name: "Marie Dupont", role: "Lead Developer" },
      { id: 2, name: "Thomas Martin", role: "UX Designer" },
      { id: 3, name: "Julie Lefebvre", role: "Backend Developer" }
    ]
  },
  "2": {
    period: "1 Oct - 1 Juin 2024",
    funding: "25 000 €",
    participants: "4 chercheurs",
    publicationDate: "12 mai 2023",
    description: "Cette formation avancée en intelligence artificielle vous permettra de maîtriser les techniques d'apprentissage automatique et de deep learning. Vous travaillerez sur des projets concrets utilisant TensorFlow et PyTorch pour développer des solutions IA innovantes.",
    team: [
      { id: 4, name: "Dr. Sophie Bernard", role: "Directrice de recherche" },
      { id: 5, name: "Alexandre Petit", role: "Data Scientist" },
      { id: 6, name: "Emma Dubois", role: "Chercheuse" },
      { id: 7, name: "Lucas Moreau", role: "Chercheur" }
    ]
  },
  "3": {
    period: "15 Nov - 15 Avril 2024",
    funding: "15 000 €",
    participants: "3 experts",
    publicationDate: "20 juillet 2023",
    description: "Cette formation en cybersécurité vous apprendra à identifier et contrer les menaces informatiques modernes. Vous développerez des compétences en ethical hacking, analyse de vulnérabilités et mise en place de systèmes de protection robustes.",
    team: [
      { id: 8, name: "Nicolas Robert", role: "Expert en sécurité" },
      { id: 9, name: "Camille Leroy", role: "Analyste" },
      { id: 10, name: "Maxime Girard", role: "Pentester" }
    ]
  }
}

// Valeurs par défaut
const defaultInfo: AdditionalInfo = {
  period: "Non spécifié",
  funding: "Non spécifié",
  participants: "Non spécifié",
  publicationDate: "Non spécifié",
  description: "Aucune description disponible",
  team: []
}

export default function EtudeDetailScreen() {
  const [bookmarked, setBookmarked] = useState(false)
  const params = useLocalSearchParams()
  const router = useRouter()
  
  // Récupération des paramètres
  const { 
    id, 
    studyTitle, 
    studyDescription, 
    studyDuration, 
    studyLevel, 
    studyImage,
    categoryTitle,
    categoryColor,
    categoryBackground
  } = params

  // Récupération des informations additionnelles avec type safety
  const studyId = Array.isArray(id) ? id[0] : id || ""
  const info = additionalInfo[studyId] || {
    ...defaultInfo,
    description: Array.isArray(studyDescription) ? studyDescription[0] : studyDescription || defaultInfo.description
  }

  const handlePostuler = () => {
    Alert.alert(
      "Candidature envoyée",
      `Votre candidature pour "${Array.isArray(studyTitle) ? studyTitle[0] : studyTitle}" a été soumise avec succès. Vous recevrez une réponse dans les prochains jours.`,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header image */}
      <View style={styles.headerContainer}>
        <Image
          source={{
            uri: Array.isArray(studyImage) ? studyImage[0] : studyImage || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1374&q=80",
          }}
          style={styles.headerImage}
        />
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
            style={[
              styles.categoryBadge, 
              { 
                backgroundColor: Array.isArray(categoryBackground) 
                  ? categoryBackground[0] 
                  : categoryBackground || "rgba(59, 130, 246, 0.1)" 
              }
            ]}
          >
            <Text 
              style={[
                styles.categoryText, 
                { 
                  color: Array.isArray(categoryColor) 
                    ? categoryColor[0] 
                    : categoryColor || "#3B82F6" 
                }
              ]}
            >
              {Array.isArray(categoryTitle) ? categoryTitle[0] : categoryTitle || "Catégorie"}
            </Text>
          </Animated.View>

          <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.title}>
            {Array.isArray(studyTitle) ? studyTitle[0] : studyTitle || "Titre de l'étude"}
          </Animated.Text>

          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="calendar-range" size={20} color="#3B82F6" />
              <View>
                <Text style={styles.infoLabel}>Durée</Text>
                <Text style={styles.infoValue}>
                  {Array.isArray(studyDuration) ? studyDuration[0] : studyDuration || info.period}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="school-outline" size={20} color="#3B82F6" />
              <View>
                <Text style={styles.infoLabel}>Niveau</Text>
                <Text style={styles.infoValue}>
                  {Array.isArray(studyLevel) ? studyLevel[0] : studyLevel || "Intermédiaire"}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <FontAwesome5 name="users" size={18} color="#3B82F6" />
              <View>
                <Text style={styles.infoLabel}>Participants</Text>
                <Text style={styles.infoValue}>{info.participants}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
            <Text style={styles.sectionTitle}>À propos de cette formation</Text>
            <Text style={styles.description}>
              {info.description}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.section}>
            <Text style={styles.sectionTitle}>Équipe pédagogique</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teamScroll}>
              {(info.team.length > 0 ? info.team : [
                { id: 1, name: "Dr. Nom Prénom", role: "Directeur de formation" },
                { id: 2, name: "Dr. Nom Prénom", role: "Formateur" },
                { id: 3, name: "Dr. Nom Prénom", role: "Formateur" }
              ]).map((member, index) => (
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
            <Text style={styles.publicationDate}>{info.publicationDate}</Text>
          </Animated.View>

          <AnimatedTouchable
            entering={FadeInUp.delay(800).springify()}
            style={styles.applyButton}
            onPress={handlePostuler}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[
                Array.isArray(categoryColor) ? categoryColor[0] : categoryColor || "#3B82F6", 
                Array.isArray(categoryColor) ? categoryColor[0] : categoryColor || "#2563EB"
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.applyButtonGradient}
            >
              <Text style={styles.applyButtonText}>S'inscrire à cette formation</Text>
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
    alignItems: "center",
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