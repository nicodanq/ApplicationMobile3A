"use client"

import FooterLogo from "@/components/FooterLogo"
import HeaderPage from "@/components/HeaderPage"
import { Ionicons } from "@expo/vector-icons"

import { useRouter } from "expo-router"
import { useState } from "react"
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


const { width } = Dimensions.get("window")
const CARD_WIDTH = width * 0.8

// Types d'études avec leurs données
const studyCategories = [
  {
    id: 'it-digital',
    title: 'IT & Digital',
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    icon: '💻',
    studies: [
      {
        id: '1',
        title: 'Développement Web Full-Stack',
        description: 'Formation complète en développement web moderne avec React, Node.js et bases de données',
        duration: '6 mois',
        level: 'Intermédiaire',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop',
      },
      {
        id: '2',
        title: 'Intelligence Artificielle',
        description: 'Apprentissage automatique, deep learning et applications pratiques de l\'IA',
        duration: '8 mois',
        level: 'Avancé',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
      },
      {
        id: '3',
        title: 'Cybersécurité',
        description: 'Sécurité informatique, ethical hacking et protection des systèmes',
        duration: '5 mois',
        level: 'Intermédiaire',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop',
      },
    ],
  },
  {
    id: 'ingenierie-systemes',
    title: 'Ingénierie des Systèmes',
    color: '#4CAF50',
    backgroundColor: '#E8F5E8',
    icon: '⚙️',
    studies: [
      {
        id: '4',
        title: 'Systèmes Embarqués',
        description: 'Conception et programmation de systèmes embarqués pour l\'industrie',
        duration: '7 mois',
        level: 'Avancé',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop',
      },
      {
        id: '5',
        title: 'Automatisation Industrielle',
        description: 'Robotique, automates programmables et systèmes de contrôle',
        duration: '6 mois',
        level: 'Intermédiaire',
        image: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400&h=200&fit=crop',
      },
      {
        id: '6',
        title: 'IoT et Connectivité',
        description: 'Internet des objets, capteurs et communication M2M',
        duration: '4 mois',
        level: 'Débutant',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
      },
    ],
  },
  {
    id: 'conseil',
    title: 'Conseil',
    color: '#E91E63',
    backgroundColor: '#FCE4EC',
    icon: '💼',
    studies: [
      {
        id: '7',
        title: 'Stratégie d\'Entreprise',
        description: 'Analyse stratégique, transformation digitale et accompagnement organisationnel',
        duration: '5 mois',
        level: 'Avancé',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
      },
      {
        id: '8',
        title: 'Management de Projet',
        description: 'Gestion de projet agile, leadership et coordination d\'équipes',
        duration: '4 mois',
        level: 'Intermédiaire',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',
      },
    ],
  },
  {
    id: 'rse',
    title: 'RSE',
    color: '#FF9800',
    backgroundColor: '#FFF3E0',
    icon: '🌱',
    studies: [
      {
        id: '9',
        title: 'Développement Durable',
        description: 'Stratégies environnementales et responsabilité sociale des entreprises',
        duration: '3 mois',
        level: 'Débutant',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop',
      },
      {
        id: '10',
        title: 'Économie Circulaire',
        description: 'Modèles économiques durables et gestion des ressources',
        duration: '4 mois',
        level: 'Intermédiaire',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop',
      },
    ],
  },
  {
    id: 'digital-culture',
    title: 'Digital & Culture',
    color: '#9C27B0',
    backgroundColor: '#F3E5F5',
    icon: '🎨',
    studies: [
      {
        id: '11',
        title: 'Design UX/UI',
        description: 'Expérience utilisateur, interface design et prototypage',
        duration: '5 mois',
        level: 'Intermédiaire',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
      },
      {
        id: '12',
        title: 'Marketing Digital',
        description: 'Stratégies digitales, réseaux sociaux et communication numérique',
        duration: '4 mois',
        level: 'Débutant',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
      },
    ],
  },
  {
    id: 'traduction-technique',
    title: 'Traduction Technique',
    color: '#00BCD4',
    backgroundColor: '#E0F2F1',
    icon: '🌐',
    studies: [
      {
        id: '13',
        title: 'Traduction Scientifique',
        description: 'Spécialisation en traduction de documents techniques et scientifiques',
        duration: '6 mois',
        level: 'Avancé',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop',
      },
      {
        id: '14',
        title: 'Localisation Logicielle',
        description: 'Adaptation culturelle et linguistique de logiciels et applications',
        duration: '4 mois',
        level: 'Intermédiaire',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
      },
    ],
  },
]

const EtudesScreen = () => {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleStudyPress = (study: any, category: any) => {
    router.push({
      pathname: '/etudes/[id]',
      params: {
        id: study.id,
        studyTitle: study.title,
        studyDescription: study.description,
        studyDuration: study.duration,
        studyLevel: study.level,
        studyImage: study.image,
        categoryTitle: category.title,
        categoryColor: category.color,
        categoryBackground: category.backgroundColor,
      },
    } as any)
  }

  const renderStudyCard = ({ item: study, index }: { item: any; index: number }, category: any) => (
    <TouchableOpacity
      style={[styles.studyCard, { marginLeft: index === 0 ? 20 : 10 }]}
      onPress={() => handleStudyPress(study, category)}
      activeOpacity={0.7}
    >
      <View style={styles.studyImageContainer}>
        <Image source={{ uri: study.image }} style={styles.studyImage} />
        <View style={styles.studyImageOverlay} />
        <View style={[styles.levelBadge, { backgroundColor: category.backgroundColor }]}>
          <Text style={[styles.levelText, { color: category.color }]}>{study.level}</Text>
        </View>
      </View>

      <View style={styles.studyContent}>
        <Text style={styles.studyTitle} numberOfLines={2}>{study.title}</Text>
        <Text style={styles.studyDescription} numberOfLines={3}>{study.description}</Text>

        <View style={styles.studyMeta}>
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={14} color="#64748B" />
            <Text style={styles.durationText}>{study.duration}</Text>
          </View>
          <TouchableOpacity style={[styles.enrollButton, { backgroundColor: category.color }]}>
            <Text style={styles.enrollButtonText}>S&apos;inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderCategorySection = (category: any) => (
    <View key={category.id} style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <View style={styles.categoryTitleContainer}>
          <View style={[styles.categoryIcon, { backgroundColor: category.backgroundColor }]}>
            <Text style={styles.categoryIconText}>{category.icon}</Text>
          </View>
          <View>
            <Text style={[styles.categoryTitle, { color: category.color }]}>{category.title}</Text>
            <Text style={styles.categorySubtitle}>{category.studies.length} formation{category.studies.length > 1 ? 's' : ''} disponible{category.studies.length > 1 ? 's' : ''}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={[styles.seeAllText, { color: category.color }]}>Voir tout</Text>
          <Ionicons name="chevron-forward" size={16} color={category.color} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={category.studies}
        renderItem={(props: any) => renderStudyCard(props, category)}
        keyExtractor={(item: any) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.studiesCarousel}
      />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header personnalisé */}
      <HeaderPage title="Études" />


      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{studyCategories.reduce((acc, cat) => acc + cat.studies.length, 0)}</Text>
          <Text style={styles.statLabel}>Études</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{studyCategories.length}</Text>
          <Text style={styles.statLabel}>Domaines</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Inscriptions</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {studyCategories.map(renderCategorySection)}
        </View>
        {/* Footer personnalisé */}
        <FooterLogo />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20, // Réduit pour laisser place au FooterPage
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryIconText: {
    fontSize: 20,
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
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  studiesCarousel: {
    paddingRight: 20,
  },
  studyCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginRight: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  studyImageContainer: {
    position: "relative",
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  studyImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  studyImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  levelBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "600",
  },
  studyContent: {
    padding: 16,
  },
  studyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
    lineHeight: 20,
  },
  studyDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 16,
  },
  studyMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 4,
  },
  enrollButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  enrollButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
})

export default EtudesScreen