"use client"

import api from "@/api/axiosClient";
import { useSession } from "@/contexts/AuthContext";
import { useUserDetails } from "@/hooks/useUserDetails";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";


import FooterLogo from "@/components/FooterLogo";

const { width } = Dimensions.get("window")

// Données fictives pour les études de l'utilisateur
type Study = {
  Id_etude: number;
  titre_etude: string;
  dateDebut_etude: string;
  dateFin_etude: string;
  description_etude: string;
  prix_etude: number;
  nbrIntervenant: number;
  img_etude: string;
  statut: string;
};

const MesEtudesScreen = () => {
  const router = useRouter();
  const { user } = useSession();
  const { details, role, loading, error } = useUserDetails(user?.id ?? null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)



  const [studiesData, setStudiesData] = useState<{
    postulees: Study[];
    enCours: Study[];
    terminees: Study[];
  }>({
    postulees: [],
    enCours: [],
    terminees: []
  });


  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const response = await api.get(`/user/etudes/${user?.id}`);
        const allStudies: Study[] = response.data;

        const postulees = allStudies.filter((s) => s.statut === "Pas commencée");
        const enCours = allStudies.filter((s) => s.statut === "En cours");
        const terminees = allStudies.filter((s) => s.statut === "Terminée");

        setStudiesData({ postulees, enCours, terminees });
      } catch (error) {
        console.error("Erreur lors de la récupération des études :", error);
      }
    };

    if (user?.id) {
      fetchStudies();
    }
  }, [user?.id]);


  const handleCategoryPress = (category: 'postulees' | 'enCours' | 'terminees') => {
    router.push({
      pathname: "/profil/[category]",
      params: { category }
    });
  }

  const categories = [
    {
      id: 'postulees',
      title: 'Postulées',
      subtitle: 'Candidatures en attente',
      count: studiesData.postulees.length,
      icon: 'paper-plane-outline',
      color: '#3B82F6',
      backgroundColor: '#EBF4FF',
      description: 'Formations pour lesquelles vous avez postulé'
    },
    {
      id: 'enCours',
      title: 'En cours',
      subtitle: 'Formations actives',
      count: studiesData.enCours.length,
      icon: 'school-outline',
      color: '#10B981',
      backgroundColor: '#ECFDF5',
      description: 'Formations que vous suivez actuellement'
    },
    {
      id: 'terminees',
      title: 'Terminées',
      subtitle: 'Formations complétées',
      count: studiesData.terminees.length,
      icon: 'trophy-outline',
      color: '#F59E0B',
      backgroundColor: '#FFFBEB',
      description: 'Formations que vous avez terminées avec succès'
    }
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header dans le style de votre capture d'écran */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes études</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>

          {/* Stats Overview */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.statsContainer}>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>
                {studiesData.postulees.length + studiesData.enCours.length + studiesData.terminees.length}
              </Text>
              <Text style={styles.statsLabel}>Total formations</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>{studiesData.enCours.length}</Text>
              <Text style={styles.statsLabel}>En cours</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>{studiesData.terminees.length}</Text>
              <Text style={styles.statsLabel}>Terminées</Text>
            </View>
          </Animated.View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <Animated.View
                key={category.id}
                entering={FadeInDown.delay(200 + index * 100)}
              >
                <TouchableOpacity
                  style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}
                  onPress={() => handleCategoryPress(category.id as any)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryHeader}>
                    <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                      <Ionicons name={category.icon as any} size={24} color="white" />
                    </View>
                    <View style={styles.categoryInfo}>
                      <Text style={[styles.categoryTitle, { color: category.color }]}>
                        {category.title}
                      </Text>
                      <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                    </View>
                    <View style={styles.categoryCount}>
                      <Text style={[styles.countNumber, { color: category.color }]}>
                        {category.count}
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color={category.color} />
                    </View>
                  </View>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Recent Activity */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Activité récente</Text>

            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Formation terminée</Text>
                <Text style={styles.activityDescription}>
                  Vous avez terminé &quot;Bases de Données Avancées&quot; avec la note A
                </Text>
                <Text style={styles.activityDate}>Il y a 3 semaines</Text>
              </View>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Ionicons name="paper-plane" size={20} color="#3B82F6" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Nouvelle candidature</Text>
                <Text style={styles.activityDescription}>
                  Candidature envoyée pour &quot;Intelligence Artificielle Avancée&quot;
                </Text>
                <Text style={styles.activityDate}>Il y a 1 semaine</Text>
              </View>
            </View>
          </Animated.View>

          {/* Inspiration Image */}
          <Animated.View entering={FadeInDown.delay(800)} style={styles.inspirationContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop"
              }}
              style={styles.inspirationImage}
            />
            <View style={styles.inspirationOverlay}>
              <Text style={styles.inspirationTitle}>Continuez à apprendre</Text>
              <Text style={styles.inspirationSubtitle}>
                Explorez de nouvelles études pour développer vos compétences
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push('/(tabs)/etudes')}
              >
                <Text style={styles.exploreButtonText}>Explorer les études</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>

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
  // Header dans le style de votre capture d'écran
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
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statsCard: {
    flex: 1,
    alignItems: "center",
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  statsDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 20,
  },
  categoriesContainer: {
    gap: 16,
    marginBottom: 32,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  categoryCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  recentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: "#94A3B8",
  },
  inspirationContainer: {
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    height: 200,
  },
  inspirationImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  inspirationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inspirationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  inspirationSubtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.9,
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  exploreButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default MesEtudesScreen