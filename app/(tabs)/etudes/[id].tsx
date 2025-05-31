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

export default function EtudeDetailScreen() {
  const [bookmarked, setBookmarked] = useState(false)
  const { id } = useLocalSearchParams()
  const router = useRouter()

  const handlePostuler = () => {
    Alert.alert(
      "Candidature envoyée",
      "Votre candidature a été soumise avec succès. Vous recevrez une réponse dans les prochains jours.",
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
            uri: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1374&q=80",
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
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.categoryBadge}>
            <Text style={styles.categoryText}>Changement Climatique : {id}</Text>
          </Animated.View>

          <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.title}>
            Impact du changement climatique sur la biodiversité mondiale
          </Animated.Text>

          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="calendar-range" size={20} color="#3B82F6" />
              <View>
                <Text style={styles.infoLabel}>Période</Text>
                <Text style={styles.infoValue}>15 Juin - 30 Sept 2023</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="currency-eur" size={20} color="#3B82F6" />
              <View>
                <Text style={styles.infoLabel}>Financement</Text>
                <Text style={styles.infoValue}>25 000 €</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <FontAwesome5 name="users" size={18} color="#3B82F6" />
              <View>
                <Text style={styles.infoLabel}>Participants</Text>
                <Text style={styles.infoValue}>4 chercheurs</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
            <Text style={styles.sectionTitle}>À propos de cette étude</Text>
            <Text style={styles.description}>
              Un récent article de recherche publié dans une revue scientifique internationale explore les effets du
              changement climatique sur la biodiversité.
            </Text>
            <Text style={styles.description}>
              Leur étude montre que l&apos;augmentation des températures et la modification des précipitations ont un impact
              direct sur les habitats naturels, entraînant la disparition de certaines espèces et le déplacement
              d&apos;autres vers de nouvelles zones.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.section}>
            <Text style={styles.sectionTitle}>Objectifs de recherche</Text>
            {[
              "Analyser les données climatiques des 50 dernières années",
              "Cartographier les changements dans la distribution des espèces",
              "Développer des modèles prédictifs pour les écosystèmes vulnérables",
              "Proposer des stratégies d’adaptation et de conservation",
            ].map((text, index) => (
              <View key={index} style={styles.objectiveItem}>
                <View style={styles.objectiveDot} />
                <Text style={styles.objectiveText}>{text}</Text>
              </View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.section}>
            <Text style={styles.sectionTitle}>Équipe de recherche</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teamScroll}>
              {[1, 2, 3, 4].map((item) => (
                <View key={item} style={styles.teamMember}>
                  <Image
                    source={{
                      uri: `https://randomuser.me/api/portraits/${item % 2 === 0 ? "women" : "men"}/${item + 10}.jpg`,
                    }}
                    style={styles.teamMemberImage}
                  />
                  <Text style={styles.teamMemberName}>Dr. Nom Prénom</Text>
                  <Text style={styles.teamMemberRole}>{item === 1 ? "Directeur de recherche" : "Chercheur"}</Text>
                </View>
              ))}
            </ScrollView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.publicationInfo}>
            <Text style={styles.publicationLabel}>Étude postée le:</Text>
            <Text style={styles.publicationDate}>12 mai 2023</Text>
          </Animated.View>

          <AnimatedTouchable
            entering={FadeInUp.delay(800).springify()}
            style={styles.applyButton}
            onPress={handlePostuler}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#3B82F6", "#2563EB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.applyButtonGradient}
            >
              <Text style={styles.applyButtonText}>Postuler à cette étude</Text>
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
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  categoryText: {
    color: "#3B82F6",
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
  objectiveItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  objectiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    marginTop: 8,
    marginRight: 12,
  },
  objectiveText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
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
