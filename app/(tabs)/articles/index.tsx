"use client"

import api from "@/api/axiosClient"
import FooterLogo from "@/components/FooterLogo"
import HeaderPage from "@/components/HeaderPage"
import { useSession } from "@/contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.75

const ArticlesScreen = () => {
  const { isAdminMode } = useSession();
  const router = useRouter()

  useFocusEffect(
    useCallback(() => {
      if (isAdminMode) {
        router.replace("/articleadmin");
      }
    }, [isAdminMode])
  );

  type Article = {
    id: string
    title: string
    description: string
    category: string
    image: string
    readTime: number
  }

  type Category = {
    id: string
    name: string
    articles: Article[]
  }

  const { user, token, isLoading } = useSession()
  const [loading, setLoading] = useState(true)
  const [categoriesData, setCategoriesData] = useState<Category[]>([])

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get("/article/")
        const rawArticles = response.data

        const formattedArticles: Article[] = rawArticles.map((article: any) => ({
          id: article.Id_article || `${article.titre_article}-${Math.random()}`,
          title: article.titre_article ?? "Titre manquant",
          description: article.description_article ?? "Pas de description",
          image: article.img_article ?? "https://placeholder.com/image.jpg",
          readTime: article.readTime ?? 10,
          category: article.categorie ?? "Autre",
        }))

        const grouped: Record<string, Article[]> = formattedArticles.reduce(
          (acc, article) => {
            if (!acc[article.category]) acc[article.category] = []
            acc[article.category].push(article)
            return acc
          },
          {} as Record<string, Article[]>,
        )

        const categoriesArray: Category[] = Object.entries(grouped).map(([title, articles]) => ({
          id: title,
          name: title,
          articles,
        }))

        setCategoriesData(categoriesArray)
      } catch (err) {
        console.error("Erreur récupération articles:", err)
        setCategoriesData([])
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [])

  const totalArticles = categoriesData.reduce((total, category) => total + category.articles.length, 0)
  const totalCategories = categoriesData.length
  const totalReadTime = categoriesData.reduce(
    (total, category) => total + category.articles.reduce((catTotal, article) => catTotal + article.readTime, 0),
    0,
  )

  const handleArticlePress = (article: Article) => {
    router.push({
      pathname: "/(tabs)/articles/[id]",
      params: {
        id: article.id,
        articleTitle: article.title,
        articleDescription: article.description,
      },
    })
  }

  const ArticleCard = ({ article }: { article: Article }) => (
    <TouchableOpacity style={styles.articleCard} onPress={() => handleArticlePress(article)} activeOpacity={0.7}>
      <Image source={{ uri: article.image }} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.articleDescription} numberOfLines={3}>
          {article.description}
        </Text>
        <View style={styles.articleFooter}>
          <View style={styles.readTimeInfo}>
            <Ionicons name="time-outline" size={16} color="#64748B" />
            <Text style={styles.readTimeText}>{article.readTime} min</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderArticlesList = (category: Category, delay: number) => (
    <Animated.View key={category.id} entering={FadeInDown.delay(delay)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{category.name}</Text>
        <Text style={styles.sectionCount}>{category.articles.length}</Text>
      </View>
      <FlatList
        data={category.articles}
        renderItem={({ item }) => <ArticleCard article={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      />
    </Animated.View>
  )

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <HeaderPage title="Articles" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <HeaderPage title="Articles" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Statistiques */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalArticles}</Text>
              <Text style={styles.statLabel}>Articles</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalCategories}</Text>
              <Text style={styles.statLabel}>Catégories</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalReadTime}</Text>
              <Text style={styles.statLabel}>Min de lecture</Text>
            </View>
          </Animated.View>

          {/* Sections des articles */}
          {categoriesData.map((category, index) => renderArticlesList(category, 200 + index * 100))}
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
  scrollView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    fontSize: 16,
    color: "#64748B",
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
  section: {
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
  listContainer: {
    paddingHorizontal: 20,
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
    justifyContent: "flex-start",
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
})

export default ArticlesScreen
