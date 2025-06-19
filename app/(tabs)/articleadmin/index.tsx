"use client"

import api from "@/api/axiosClient"
import FooterLogo from "@/components/FooterLogo"
import HeaderPage from "@/components/HeaderPage"
import { useSession } from "@/contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState, useCallback } from "react"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { useFocusEffect } from "@react-navigation/native"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.75

type Article = {
  id: string
  titre_article: string
  description_article: string
  datePublication_article: string
  img_article: string
  auteur_article: string
  readTime: string
  categorie: string
  ID_user: string
}

type Category = {
  id: string
  title: string
  articles: Article[]
}

const AdminArticlesScreen = () => {
  const router = useRouter()
  const { user, token } = useSession()

  const [loading, setLoading] = useState(true)
  const [categoriesData, setCategoriesData] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)

  const [isAddArticleModalVisible, setIsAddArticleModalVisible] = useState(false)
  const [isEditArticleModalVisible, setIsEditArticleModalVisible] = useState(false)
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const [newArticle, setNewArticle] = useState({
    titre_article: "",
    description_article: "",
    datePublication_article: "",
    img_article: "",
    auteur_article: "",
  })

  const [newCategory, setNewCategory] = useState({
    title: "",
  })

  const fetchArticles = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get("/article/")
      const rawArticles = response.data

      console.log("Articles récupérés:", rawArticles)

      // Transformer les données
      const formattedArticles: Article[] = rawArticles.map((article: any) => ({
        id: article.Id_article?.toString() || `${article.titre_article}-${Math.random()}`,
        titre_article: article.titre_article ?? "Titre manquant",
        description_article: article.description_article ?? "Pas de description",
        datePublication_article: article.datePublication_article
          ? new Date(article.datePublication_article).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        img_article:
          article.img_article ??
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
        auteur_article: article.auteur_article ?? "Auteur EPF",
        readTime: article.readTime ? `${article.readTime} min` : "5 min",
        categorie: article.categorie ?? "Autre",
        ID_user: article.ID_user?.toString() ?? "",
      }))

      // Grouper par catégorie
      const grouped: Record<string, Article[]> = formattedArticles.reduce(
        (acc, article) => {
          if (!acc[article.categorie]) acc[article.categorie] = []
          acc[article.categorie].push(article)
          return acc
        },
        {} as Record<string, Article[]>,
      )

      // Créer les catégories
      const categoriesArray: Category[] = Object.entries(grouped).map(([categoryName, articles]) => ({
        id: categoryName.toLowerCase().replace(/\s+/g, "-"),
        title: categoryName,
        articles,
      }))

      setCategoriesData(categoriesArray)
    } catch (err) {
      console.error("Erreur récupération articles:", err)
      setError("Erreur lors du chargement des articles")
      setCategoriesData([])
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchArticles()
    }, []),
  )

  // Calcul des statistiques
  const totalArticles = categoriesData.reduce((total, category) => total + category.articles.length, 0)
  const totalCategories = categoriesData.length

  const handleArticlePress = (article: Article, category: Category) => {
    router.push({
      pathname: "/(tabs)/articleadmin/[id]",
      params: {
        id: article.id,
        articleTitle: article.titre_article,
        articleDescription: article.description_article,
      },
    })
  }

  const handleAddArticle = async () => {
    if (selectedCategory && newArticle.titre_article && newArticle.description_article && newArticle.auteur_article) {
      try {
        // Appel API pour créer l'article
        const articleData = {
          titre_article: newArticle.titre_article,
          description_article: newArticle.description_article,
          datePublication_article: newArticle.datePublication_article || new Date().toISOString().split("T")[0],
          img_article:
            newArticle.img_article ||
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
          auteur_article: newArticle.auteur_article,
          readTime: 5, // Valeur par défaut
          categorie: selectedCategory.title,
          ID_user: user?.id || 1,
        }

        const response = await api.post("/article/", articleData)

        if (response.status === 201 || response.status === 200) {
          // Réinitialiser le formulaire
          setNewArticle({
            titre_article: "",
            description_article: "",
            datePublication_article: "",
            img_article: "",
            auteur_article: "",
          })
          setIsAddArticleModalVisible(false)

          // Forcer le rechargement des données
          await fetchArticles()

          Alert.alert("Succès", "Article ajouté avec succès!")
        }
      } catch (err) {
        console.error("Erreur création article:", err)
        Alert.alert("Erreur", "Impossible de créer l'article")
      }
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires (titre, description, auteur)")
    }
  }

  const handleEditArticle = async () => {
    if (selectedCategory && selectedArticle && selectedArticle.titre_article && selectedArticle.description_article) {
      try {
        // Appel API pour modifier l'article
        const articleData = {
          titre_article: selectedArticle.titre_article,
          description_article: selectedArticle.description_article,
          datePublication_article: selectedArticle.datePublication_article,
          img_article: selectedArticle.img_article,
          auteur_article: selectedArticle.auteur_article,
          categorie: selectedCategory.title,
        }

        const response = await api.put(`/article/${selectedArticle.id}`, articleData)

        if (response.status === 200) {
          setSelectedArticle(null)
          setIsEditArticleModalVisible(false)
          Alert.alert("Succès", "Article modifié avec succès!")
          // Les données seront rafraîchies automatiquement grâce à useFocusEffect
        }
      } catch (err) {
        console.error("Erreur modification article:", err)
        Alert.alert("Erreur", "Impossible de modifier l'article")
      }
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
    }
  }

  const handleDeleteArticle = (categoryId: string, articleId: string) => {
    Alert.alert("Confirmation", "Êtes-vous sûr de vouloir supprimer cet article ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await api.delete(`/article/${articleId}`)

            if (response.status === 200) {
              Alert.alert("Succès", "Article supprimé avec succès!")
              // Les données seront rafraîchies automatiquement grâce à useFocusEffect
            }
          } catch (err) {
            console.error("Erreur suppression article:", err)
            Alert.alert("Erreur", "Impossible de supprimer l'article")
          }
        },
      },
    ])
  }

  const handleAddCategory = async () => {
    if (newCategory.title.trim()) {
      try {
        // Appel API pour créer la catégorie
        const categoryData = {
          typeArticle: newCategory.title,
        }

        const response = await api.post("/type-article/", categoryData)

        if (response.status === 201 || response.status === 200) {
          setNewCategory({ title: "" })
          setIsAddCategoryModalVisible(false)
          Alert.alert("Succès", "Catégorie ajoutée avec succès!")
          // Les données seront rafraîchies automatiquement grâce à useFocusEffect
        }
      } catch (err) {
        console.error("Erreur création catégorie:", err)
        Alert.alert("Erreur", "Impossible de créer la catégorie")
      }
    } else {
      Alert.alert("Erreur", "Veuillez saisir un nom de catégorie")
    }
  }

  const ArticleCard = ({ article, category }: { article: Article; category: Category }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => handleArticlePress(article, category)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: article.img_article }} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle} numberOfLines={2}>
          {article.titre_article}
        </Text>
        <Text style={styles.articleDescription} numberOfLines={3}>
          {article.description_article}
        </Text>
        <View style={styles.articleFooter}>
          <View style={styles.readTimeInfo}>
            <Ionicons name="time-outline" size={16} color="#64748B" />
            <Text style={styles.readTimeText}>{article.readTime}</Text>
          </View>
          <Text style={styles.authorText}>Par {article.auteur_article}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderArticlesList = (category: Category, delay: number) => (
    <Animated.View key={`category-${category.id}`} entering={FadeInDown.delay(delay)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{category.title}</Text>
        <View style={styles.sectionActions}>
          <Text style={styles.sectionCount}>{category.articles.length}</Text>
          <TouchableOpacity
            style={styles.addArticleButton}
            onPress={() => {
              setSelectedCategory(category)
              setIsAddArticleModalVisible(true)
            }}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      {category.articles.length > 0 ? (
        <FlatList
          data={category.articles}
          renderItem={({ item }) => <ArticleCard article={item} category={category} />}
          keyExtractor={(item) => `article-${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        />
      ) : (
        <View style={styles.emptySection}>
          <Text style={styles.emptyText}>Aucun article dans cette catégorie</Text>
        </View>
      )}
    </Animated.View>
  )

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <HeaderPage title="Articles" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Chargement des articles...</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <HeaderPage title="Articles" />
    
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
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
              <Text style={styles.statNumber}>Admin</Text>
              <Text style={styles.statLabel}>Mode</Text>
            </View>
          </Animated.View>

          {/* Sections des articles */}
          {categoriesData.length > 0 ? (
            categoriesData.map((category, index) => renderArticlesList(category, 200 + index * 100))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun article disponible pour le moment</Text>
            </View>
          )}
        </View>
        <FooterLogo />
      </ScrollView>

      {/* Add Article Modal */}
      <Modal visible={isAddArticleModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un article</Text>
            <Text style={styles.modalSubtitle}>Catégorie: {selectedCategory?.title}</Text>

            <ScrollView style={styles.modalScrollView}>
              <TextInput
                style={styles.input}
                placeholder="Titre de l'article *"
                value={newArticle.titre_article}
                onChangeText={(text) => setNewArticle({ ...newArticle, titre_article: text })}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description de l'article *"
                multiline
                numberOfLines={4}
                value={newArticle.description_article}
                onChangeText={(text) => setNewArticle({ ...newArticle, description_article: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Auteur de l'article *"
                value={newArticle.auteur_article}
                onChangeText={(text) => setNewArticle({ ...newArticle, auteur_article: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Date de publication (YYYY-MM-DD)"
                value={newArticle.datePublication_article}
                onChangeText={(text) => setNewArticle({ ...newArticle, datePublication_article: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="URL de l'image"
                value={newArticle.img_article}
                onChangeText={(text) => setNewArticle({ ...newArticle, img_article: text })}
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAddArticleModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleAddArticle}>
                <Text style={styles.saveButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Article Modal */}
      <Modal visible={isEditArticleModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier l'article</Text>
            <Text style={styles.modalSubtitle}>Catégorie: {selectedCategory?.title}</Text>

            <ScrollView style={styles.modalScrollView}>
              <TextInput
                style={styles.input}
                placeholder="Titre de l'article *"
                value={selectedArticle?.titre_article}
                onChangeText={(text) => setSelectedArticle({ ...selectedArticle!, titre_article: text })}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description de l'article *"
                multiline
                numberOfLines={4}
                value={selectedArticle?.description_article}
                onChangeText={(text) => setSelectedArticle({ ...selectedArticle!, description_article: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Auteur de l'article *"
                value={selectedArticle?.auteur_article}
                onChangeText={(text) => setSelectedArticle({ ...selectedArticle!, auteur_article: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Date de publication (YYYY-MM-DD)"
                value={selectedArticle?.datePublication_article}
                onChangeText={(text) => setSelectedArticle({ ...selectedArticle!, datePublication_article: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="URL de l'image"
                value={selectedArticle?.img_article}
                onChangeText={(text) => setSelectedArticle({ ...selectedArticle!, img_article: text })}
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditArticleModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleEditArticle}>
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Category Modal */}
      <Modal visible={isAddCategoryModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une catégorie</Text>

            <TextInput
              style={styles.input}
              placeholder="Nom de la catégorie *"
              value={newCategory.title}
              onChangeText={(text) => setNewCategory({ ...newCategory, title: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAddCategoryModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleAddCategory}>
                <Text style={styles.saveButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  retryButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
  emptySection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },

  addCategoryButton: {
    position: "absolute",
    right: 20,
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
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
    flex: 1,
  },
  sectionActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionCount: {
    fontSize: 16,
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addArticleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  articleCard: {
    position: "relative",
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
  authorText: {
    fontSize: 12,
    color: "#64748B",
    fontStyle: "italic",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000000",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 20,
  },
  modalScrollView: {
    maxHeight: 300,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#F8FAFC",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F1F5F9",
  },
  cancelButtonText: {
    color: "#64748B",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#3B82F6",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
})

export default AdminArticlesScreen