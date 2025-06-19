"use client"

import { useState } from "react"
import FooterLogo from "@/components/FooterLogo"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")
const cardWidth = width - 40

type Article = {
  id: string
  titre: string
  description: string
  categorie: string
  datePublication: string
  image: string
  auteur: string
  readTime: number
}

// Articles en dur
const articlesData: Article[] = [
  {
    id: "1",
    titre: "L'intelligence artificielle transforme le design UX",
    description:
      "L'intelligence artificielle transforme le design UX. En 2024, les interfaces adaptatives deviennent courantes : les applications apprennent des comportements utilisateurs pour ajuster les parcours, proposer des contenus personnalisés, voire anticiper les besoins. Des outils comme Figma AI, Galileo ou Uizard permettent de générer des interfaces à partir de simples textes. L'UX designer devient alors chef d'orchestre, guidant l'IA au lieu de tout concevoir à la main. L'accessibilité bénéficie aussi de l'IA : reconnaissance vocale, navigation prédictive et adaptation aux handicaps sont intégrés dès la conception. Toutefois, cette automatisation pose des questions éthiques : biais, sur-personnalisation, et perte de contrôle de l'utilisateur. Les bons designers UX 2024 sont ceux qui savent conjuguer IA et empathie utilisateur.",
    categorie: "AI & UX",
    datePublication: "2024-02-10",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop",
    auteur: "Isabelle",
    readTime: 12,
  },
  {
    id: "2",
    titre: "Le Big Data révolutionne l'analyse culturelle",
    description:
      "Le Big Data ne se limite plus à l'analyse économique : il devient un outil d'étude des comportements sociaux et culturels. En 2024, de nombreuses organisations utilisent les données pour comprendre les dynamiques d'inclusion, les discriminations algorithmiques ou l'impact culturel de certaines plateformes. Netflix, Spotify ou TikTok analysent en profondeur les préférences culturelles pour proposer des contenus ultra ciblés. Dans le domaine public, les données massives servent à orienter les politiques éducatives ou sanitaires. Cette intersection entre data science et sciences humaines ouvre la voie à une lecture augmentée de la société. Toutefois, elle implique une vigilance éthique accrue : toute donnée est interprétée, et la façon de la collecter ou l'analyser peut renforcer des biais existants. La donnée culturelle est une nouvelle frontière.",
    categorie: "Data & Culture",
    datePublication: "2024-02-15",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    auteur: "Julien",
    readTime: 10,
  },
]

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: { bg: string; text: string } } = {
    "AI & UX": { bg: "#E3F2FD", text: "#2196F3" },
    "Data & Culture": { bg: "#F3E5F5", text: "#9C27B0" },
  }
  return colors[category] || { bg: "#F5F5F5", text: "#757575" }
}

const ArticleCard = ({ article, onPress }: { article: Article; onPress: () => void }) => {
  const categoryColors = getCategoryColor(article.categorie)

  return (
    <TouchableOpacity style={styles.articleCard} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: article.image }} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <View style={styles.articleHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColors.bg }]}>
            <Text style={[styles.categoryText, { color: categoryColors.text }]}>{article.categorie}</Text>
          </View>
        </View>
        <Text style={styles.articleTitle} numberOfLines={2}>
          {article.titre}
        </Text>
        <Text style={styles.articleDescription} numberOfLines={3}>
          {article.description}
        </Text>
        <View style={styles.articleFooter}>
          <View style={styles.authorInfo}>
            <View style={styles.authorAvatar}>
              <Text style={styles.avatarText}>{article.auteur.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.authorText}>{article.auteur}</Text>
          </View>
          <View style={styles.readTimeInfo}>
            <Ionicons name="time-outline" size={16} color="#64748B" />
            <Text style={styles.readTimeText}>{article.readTime} min</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const ArticlesScreen = () => {
  const router = useRouter()
  const [articles] = useState<Article[]>(articlesData)

  const handleArticlePress = (article: Article) => {
    router.push({
      pathname: "/(tabs)/profil/detail_article",
      params: {
        id: article.id,
        articleData: JSON.stringify(article),
      },
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header simple */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Articles enregistrés</Text>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Statistiques */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{articles.length}</Text>
              <Text style={styles.statLabel}>Total Articles</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Catégories</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Auteurs</Text>
            </View>
          </Animated.View>

          {/* Liste des articles */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.articlesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Articles récents</Text>
              <Text style={styles.sectionCount}>{articles.length}</Text>
            </View>

            <View style={styles.articlesContainer}>
              {articles.map((article, index) => (
                <Animated.View key={article.id} entering={FadeInDown.delay(300 + index * 100)}>
                  <ArticleCard article={article} onPress={() => handleArticlePress(article)} />
                </Animated.View>
              ))}
            </View>
          </Animated.View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    marginRight: 15,
    padding: 5,
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
  articlesSection: {
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
  articlesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  articleCard: {
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
  articleImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#F1F5F9",
  },
  articleContent: {
    padding: 16,
  },
  articleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
    lineHeight: 24,
  },
  articleDescription: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
    lineHeight: 20,
  },
  articleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  authorText: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
  },
  readTimeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  readTimeText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 4,
  },
})

export default ArticlesScreen
