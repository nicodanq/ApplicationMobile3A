"use client"

import api from "@/api/axiosClient"
import FooterLogo from "@/components/FooterLogo"
import { useSession } from "@/contexts/AuthContext"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
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
  ActivityIndicator,
} from "react-native"

const { width } = Dimensions.get("window")

type Article = {
  id: string
  title: string
  description: string
  category: string
  image: string
  readTime: number
  author: string
  publishDate: string
  userId: string
}

const ArticleDetailScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { user, token, isLoading } = useSession()

  const [loading, setLoading] = useState(true)
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [error, setError] = useState<string | null>(null)

  const { id } = params

  useEffect(() => {
    const fetchArticleDetails = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)

        // Récupérer tous les articles
        const response = await api.get("/article/")
        const rawArticles = response.data

        // Transformer les données
        const formattedArticles: Article[] = rawArticles.map((article: any) => ({
          id: article.Id_article?.toString() || `${article.titre_article}-${Math.random()}`,
          title: article.titre_article ?? "Titre manquant",
          description: article.description_article ?? "Pas de description",
          image:
            article.img_article ?? "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop",
          readTime: article.readTime ?? 5,
          category: article.categorie ?? "Autre",
          author: article.auteur_article ?? "Auteur EPF",
          publishDate: article.datePublication_article
            ? new Date(article.datePublication_article).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Date inconnue",
          userId: article.ID_user?.toString() ?? "",
        }))

        // Trouver l'article spécifique
        const currentArticle = formattedArticles.find((art) => art.id === id)

        if (currentArticle) {
          setArticle(currentArticle)

          // Trouver les articles similaires (même catégorie, excluant l'article actuel)
          const related = formattedArticles
            .filter((art) => art.category === currentArticle.category && art.id !== currentArticle.id)
            .slice(0, 5) // Limiter à 5 articles similaires

          setRelatedArticles(related)
        } else {
          setError("Article non trouvé")
        }
      } catch (err) {
        console.error("Erreur récupération article:", err)
        setError("Erreur lors du chargement de l'article")
      } finally {
        setLoading(false)
      }
    }

    fetchArticleDetails()
  }, [id])

  const handleRelatedArticlePress = (relatedArticle: Article) => {
    router.push({
      pathname: "/(tabs)/articles/[id]",
      params: {
        id: relatedArticle.id,
        articleTitle: relatedArticle.title,
        articleDescription: relatedArticle.description,
      },
    })
  }

  // Fonction pour obtenir une couleur basée sur la catégorie
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      "Technologies et Outils": { bg: "#E3F2FD", text: "#2196F3" },
      "Intelligence Artificielle & Data": { bg: "#F3E5F5", text: "#9C27B0" },
      Cybersécurité: { bg: "#FFEBEE", text: "#F44336" },
      "Développement Mobile": { bg: "#E8F5E8", text: "#4CAF50" },
      "UX/UI Design": { bg: "#FFF3E0", text: "#FF9800" },
      Autre: { bg: "#F5F5F5", text: "#757575" },
    }
    return colors[category] || colors["Autre"]
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Chargement de l'article...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error || !article) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Article non trouvé"}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const categoryColors = getCategoryColor(article.category)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>

        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Main Card */}
          <View style={styles.mainCard}>
            {/* Image */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: article.image }} style={styles.headerImage} />
              <View style={styles.imageOverlay} />

              {/* Category Badge */}
              <View style={[styles.categoryBadge, { backgroundColor: categoryColors.bg }]}>
                <Text style={[styles.categoryText, { color: categoryColors.text }]}>{article.category}</Text>
              </View>

              {/* Reading time badge */}
              <View style={styles.readTimeBadge}>
                <Text style={styles.readTimeText}>📖 {article.readTime} min</Text>
              </View>
            </View>

            {/* Title and Description */}
            <View style={styles.contentSection}>
              <Text style={styles.articleTitle}>{article.title}</Text>

              {/* Meta information */}
              <View style={styles.metaSection}>
                <View style={styles.authorSection}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.avatarText}>{article.author.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorText}>{article.author}</Text>
                    <Text style={styles.publishDate}>{article.publishDate}</Text>
                  </View>
                </View>
              </View>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{article.category}</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{article.readTime} min</Text>
                </View>
              </View>

              <Text style={styles.articleDescription}>{article.description}</Text>

              {/* Action buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.likeButton}>
                  <Text style={styles.actionIcon}>👍</Text>
                  <Text style={styles.actionText}>J'aime</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookmarkButton}>
                  <Text style={styles.actionIcon}>🔖</Text>
                  <Text style={styles.actionText}>Sauvegarder</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButtonAction}>
                  <Text style={styles.actionIcon}>📤</Text>
                  <Text style={styles.actionText}>Partager</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Related articles section */}
          {relatedArticles.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>Articles similaires</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relatedArticles.map((relatedArticle) => (
                  <TouchableOpacity
                    key={relatedArticle.id}
                    style={styles.relatedCard}
                    onPress={() => handleRelatedArticlePress(relatedArticle)}
                  >
                    <Image source={{ uri: relatedArticle.image }} style={styles.relatedImage} />
                    <Text style={styles.relatedCardTitle} numberOfLines={2}>
                      {relatedArticle.title}
                    </Text>
                    <Text style={styles.relatedCardMeta}>
                      {relatedArticle.readTime} min • {relatedArticle.author}
                    </Text>
                  </TouchableOpacity>
                ))}
                 <FooterLogo />
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748B",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backArrow: {
    fontSize: 20,
    color: "#1E293B",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    marginBottom: 20,
  },
  imageContainer: {
    position: "relative",
    height: 240,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 20,
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  readTimeBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  readTimeText: {
    fontSize: 12,
    color: "#1E293B",
    fontWeight: "500",
  },
  contentSection: {
    padding: 24,
  },
  articleTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 20,
    lineHeight: 34,
  },
  metaSection: {
    marginBottom: 20,
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  authorInfo: {
    flex: 1,
  },
  authorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  publishDate: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  articleDescription: {
    fontSize: 17,
    lineHeight: 26,
    color: "#374151",
    textAlign: "justify",
    marginBottom: 30,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  likeButton: {
    alignItems: "center",
    flex: 1,
  },
  bookmarkButton: {
    alignItems: "center",
    flex: 1,
  },
  shareButtonAction: {
    alignItems: "center",
    flex: 1,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  relatedSection: {
    marginTop: 20,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  relatedCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  relatedImage: {
    width: "100%",
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: "cover",
  },
  relatedCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  relatedCardMeta: {
    fontSize: 12,
    color: "#64748B",
  },
})

export default ArticleDetailScreen
