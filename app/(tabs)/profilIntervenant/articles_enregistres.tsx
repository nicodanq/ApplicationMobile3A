"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native"

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
      title: "IT & Digital",
      category: "Technologie : IT & Digital",
      description: "Les technologies numériques continuent d'évoluer à un rythme effréné...",
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop",
      categoryColor: "#2196F3",
      backgroundColor: "#E3F2FD",
      savedDate: "15 Jan 2024",
    },
    {
      id: "2",
      title: "Ingénierie des Systèmes",
      category: "Innovation : Ingénierie des Systèmes",
      description: "L'ingénierie des systèmes fait face à des défis croissants...",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      categoryColor: "#4CAF50",
      backgroundColor: "#E8F5E8",
      savedDate: "12 Jan 2024",
    },
    {
      id: "3",
      title: "Conseil",
      category: "Stratégie : Conseil",
      description: "La transformation digitale est devenue un enjeu majeur...",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      categoryColor: "#E91E63",
      backgroundColor: "#FCE4EC",
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
            // Optionnel : afficher un message de confirmation
            // Alert.alert("Article supprimé", "L'article a été retiré de vos favoris")
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
        pathname: '/(tabs)/profilIntervenant/detail_article',
        params: {
          id: article.id,
          articleTitle: article.title,
          articleDescription: article.description,
          articleTitleColor: article.categoryColor,
          articleBackgroundColor: article.backgroundColor,
          returnTo: "articles-enregistres",
        },
      } as any)
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          accessibilityLabel="Retour"
          accessibilityRole="button"
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
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {savedArticles.length > 0 ? (
            savedArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => handleArticlePress(article)}
                activeOpacity={0.7}
                disabled={isLoading}
                accessibilityLabel={`Article ${article.title}, catégorie ${article.category}`}
                accessibilityRole="button"
              >
                <View style={[styles.card, { backgroundColor: article.backgroundColor }]}>
                  <View style={styles.cardContent}>
                    <View style={styles.imageContainer}>
                      <ImageWithPlaceholder 
                        uri={article.image} 
                        style={styles.cardImage} 
                      />
                      <View style={styles.imageOverlay} />
                    </View>

                    <View style={styles.textContainer}>
                      <View style={styles.categoryBadge}>
                        <Text style={[styles.categoryText, { color: article.categoryColor }]}>
                          {article.category}
                        </Text>
                      </View>

                      <Text style={styles.cardTitle}>{article.title}</Text>

                      <Text style={styles.cardDescription} numberOfLines={3}>
                        {article.description}
                      </Text>

                      <View style={styles.cardFooter}>
                        <Text style={styles.savedDate}>Enregistré le {article.savedDate}</Text>
                        <TouchableOpacity 
                          style={styles.removeButton} 
                          onPress={(e) => {
                            e.stopPropagation() // Empêche la navigation vers les détails
                            handleRemoveArticle(article.id, article.title)
                          }}
                          accessibilityLabel={`Supprimer l'article ${article.title}`}
                          accessibilityRole="button"
                        >
                          <Ionicons name="bookmark" size={20} color="#FF9800" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="bookmark-outline" size={64} color="#94A3B8" />
              <Text style={styles.emptyTitle}>Aucun article enregistré</Text>
              <Text style={styles.emptyDescription}>
                Les articles que vous enregistrerez apparaîtront ici
              </Text>
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => router.push('/(tabs)/articles')}
              >
                <Text style={styles.exploreButtonText}>Explorer les articles</Text>
              </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    marginRight: 15,
    padding: 5, // Zone de touch plus grande
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  articleCard: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  textContainer: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  savedDate: {
    fontSize: 12,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  removeButton: {
    padding: 8, // Zone de touch plus grande
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
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
    backgroundColor: "#2196F3",
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