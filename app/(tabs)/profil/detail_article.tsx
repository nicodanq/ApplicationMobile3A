"use client"

import FooterLogo from "@/components/FooterLogo"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
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
  Alert,
} from "react-native"

const { width } = Dimensions.get("window")

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

const ArticleDetailScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [isSaved, setIsSaved] = useState(true) // Par défaut sauvegardé

  // Récupérer les données de l'article depuis les paramètres
  const article: Article = params.articleData ? JSON.parse(params.articleData as string) : null

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Article non trouvé</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Fonction pour obtenir une couleur basée sur la catégorie
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      "AI & UX": { bg: "#E3F2FD", text: "#2196F3" },
      "Data & Culture": { bg: "#F3E5F5", text: "#9C27B0" },
    }
    return colors[category] || { bg: "#F5F5F5", text: "#757575" }
  }

  const handleSaveToggle = () => {
    setIsSaved(!isSaved)
    Alert.alert(
      isSaved ? "Article retiré" : "Article sauvegardé",
      isSaved ? "L'article a été retiré de vos favoris" : "L'article a été ajouté à vos favoris",
    )
  }

  const categoryColors = getCategoryColor(article.categorie)

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
                <Text style={[styles.categoryText, { color: categoryColors.text }]}>{article.categorie}</Text>
              </View>

              {/* Reading time badge */}
              <View style={styles.readTimeBadge}>
                <Text style={styles.readTimeText}>📖 {article.readTime} min</Text>
              </View>
            </View>

            {/* Title and Description */}
            <View style={styles.contentSection}>
              <Text style={styles.articleTitle}>{article.titre}</Text>

              {/* Meta information */}
              <View style={styles.metaSection}>
                <View style={styles.authorSection}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.avatarText}>{article.auteur.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorText}>{article.auteur}</Text>
                    <Text style={styles.publishDate}>
                      {new Date(article.datePublication).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{article.categorie}</Text>
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
                <TouchableOpacity style={styles.bookmarkButton} onPress={handleSaveToggle}>
                  <Text style={styles.actionIcon}>{isSaved ? "🔖" : "📌"}</Text>
                  <Text style={styles.actionText}>{isSaved ? "Ne plus sauvegarder" : "Sauvegarder"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButtonAction}>
                  <Text style={styles.actionIcon}>📤</Text>
                  <Text style={styles.actionText}>Partager</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
})

export default ArticleDetailScreen
