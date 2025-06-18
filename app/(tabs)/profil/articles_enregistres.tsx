"use client"

import api from "@/api/axiosClient";
import FooterLogo from "@/components/FooterLogo";
import { useSession } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

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
  const router = useRouter();
  const { user } = useSession();
  const [isLoading, setIsLoading] = useState(false)
  const [savedArticles, setSavedArticles] = useState<any[]>([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchUserArticles = async () => {
      if (!user?.id) return;

      try {
        setIsFetching(true)
        const response = await api.get(`/user/articles/${user.id}`);
        setSavedArticles(response.data); // Les données viennent directement de la BDD
      } catch (error) {
        console.error("Erreur de récupération des articles favoris :", error);
        setSavedArticles([]); // Si erreur, on met un tableau vide
      } finally {
        setIsFetching(false)
      }
    }

    fetchUserArticles();
  }, [user?.id]);

  const handleRemoveArticle = (articleId: number, articleTitle: string) => {
    Alert.alert(
      "Supprimer l'article",
      `Êtes-vous sûr de vouloir supprimer "${articleTitle}" de vos articles enregistrés ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer", style: "destructive",
          onPress: () => {
            setSavedArticles(prev => prev.filter(article => article.Id_article !== articleId));
          }
        }
      ]
    );
  };

  const handleArticlePress = async (article: any) => {
    try {
      setIsLoading(true)
      await router.push({
        pathname: '/(tabs)/articles/[id]',
        params: {
          id: article.Id_article,
          articleTitle: article.titre_article,
          articleDescription: article.description_article,
        },
      })
    } catch (error) {
      console.error('Erreur de navigation:', error)
      Alert.alert("Erreur", "Impossible d'ouvrir l'article. Veuillez réessayer.")
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
      <Image source={{ uri: article.img_article }} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle} numberOfLines={2}>{article.titre_article}</Text>
        <Text style={styles.articleDescription} numberOfLines={3}>{article.description_article}</Text>
        <View style={styles.articleFooter}>
          <View style={styles.readTimeInfo}>
            <Ionicons name="time-outline" size={16} color="#64748B" />
            <Text style={styles.readTimeText}>{article.datePublication_article}</Text>
          </View>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={(e) => {
              e.stopPropagation()
              handleRemoveArticle(article.Id_article, article.titre_article)
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

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Articles enregistrés</Text>
        {!isFetching && savedArticles.length > 0 && (
          <Text style={styles.articleCount}>({savedArticles.length})</Text>
        )}
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {isFetching ? (
            <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
          ) : savedArticles.length > 0 ? (
            <Animated.View entering={FadeInDown.delay(200)} style={styles.articlesContainer}>
              {savedArticles.map((article) => (
                <ArticleCard key={article.Id_article} article={article} />
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