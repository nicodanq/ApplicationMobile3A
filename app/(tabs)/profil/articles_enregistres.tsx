"use client"

import FooterLogo from "@/components/FooterLogo"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.75

// Composant pour les images avec placeholder
const ImageWithPlaceholder = ({ uri, style }: { uri: string; style: any }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  return (
    <View style={style}>
      {(!imageLoaded || imageError) && (
        <View style={[style, { 
          backgroundColor: '#E2E8F0', 
          justifyContent: 'center', 
          alignItems: 'center',
          position: 'absolute',
          zIndex: 1
        }]}>
          <Ionicons name="image-outline" size={24} color="#94A3B8" />
        </View>
      )}
      <Image 
        source={{ uri }} 
        style={style}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </View>
  )
}

const ArticlesEnregistresScreen = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Articles enregistrés (données d'exemple)
  const [savedArticles, setSavedArticles] = useState([
    {
      id: "1",
      title: "Développement Web",
      description: "Formation complète en développement web moderne avec React, Node.js et bases de données",
      category: "WEB DEVELOPMENT",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
      readTime: "8 min",
      savedDate: "15 Jan 2024",
    },
    {
      id: "2",
      title: "Base de Données",
      description: "Maîtrisez les concepts avancés des bases de données relationnelles et NoSQL",
      category: "DATABASE",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=300&h=200&fit=crop",
      readTime: "12 min",
      savedDate: "12 Jan 2024",
    },
    {
      id: "3",
      title: "DevOps",
      description: "Automatisation et déploiement continu avec Docker, Kubernetes et CI/CD",
      category: "DEVOPS",
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=300&h=200&fit=crop",
      readTime: "15 min",
      savedDate: "10 Jan 2024",
    },
  ])

  // Fonction améliorée pour supprimer un article avec confirmation
  const handleRemoveArticle = (articleId: string, articleTitle: string) => {
    Alert.alert(
      "Supprimer l'article",
      `Êtes-vous sûr de vouloir supprimer "${articleTitle}" de vos articles enregistrés ?`,
      [
        { 
          text: "Annuler", 
          style: "cancel" 
        },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => {
            setSavedArticles((prev) => prev.filter((article) => article.id !== articleId))
          }
        }
      ]
    )
  }

  // Fonction améliorée pour naviguer vers les détails avec gestion d'erreur
  const handleArticlePress = async (article: any) => {
    try {
      setIsLoading(true)
      
      // Navigation avec gestion d'erreur
      await router.push({
        pathname: '/(tabs)/articles/[id]',
        params: {
          id: article.id,
          articleTitle: article.title,
          articleDescription: article.description,
        },
      })
    } catch (error) {
      console.error('Erreur de navigation:', error)
      Alert.alert(
        "Erreur", 
        "Impossible d'ouvrir l'article. Veuillez réessayer.",
        [{ text: "OK" }]
      )
    } finally {
      setIsLoading(false)
    }
  }

  const ArticleCard = ({ article }: { article: any }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => handleArticlePress(article)}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      <Image source={{ uri: article.image }} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
        <Text style={styles.articleDescription} numberOfLines={3}>{article.description}</Text>
        <View style={styles.articleFooter}>
          <View style={styles.readTimeInfo}>
            <Ionicons name="time-outline" size={16} color="#64748B" />
            <Text style={styles.readTimeText}>{article.readTime}</Text>
          </View>
          <TouchableOpacity 
            style={styles.bookmarkButton}
            onPress={(e) => {
              e.stopPropagation()
              handleRemoveArticle(article.id, article.title)
            }}
          >
            <Ionicons name="bookmark" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Articles enregistrés</Text>
        {savedArticles.length > 0 && (
          <Text style={styles.articleCount}>({savedArticles.length})</Text>
        )}
      </View>

      {/* Indicateur de chargement */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {savedArticles.length > 0 ? (
            <Animated.View entering={FadeInDown.delay(200)} style={styles.articlesContainer}>
              {savedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </Animated.View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="bookmark-outline" size={64} color="#94A3B8" />
              <Text style={styles.emptyTitle}>Aucun article enregistré</Text>
              <Text style={styles.emptyDescription}>
                Les articles que vous enregistrerez apparaîtront ici
              </Text>
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => router.push('/profil/detail_article')}
              >
                <Text style={styles.exploreButtonText}>Explorer les articles</Text>
              </TouchableOpacity>
            </View>
          )}
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
  articleCount: {
    fontSize: 16,
    color: "#64748B",
    fontWeight: "500",
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  articlesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  articleCard: {
    width: "100%",
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
    height: 120,
    backgroundColor: "#F1F5F9",
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 12,
    lineHeight: 20,
  },
  articleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  bookmarkButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#64748B",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ArticlesEnregistresScreen