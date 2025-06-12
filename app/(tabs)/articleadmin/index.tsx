"use client"

import { Ionicons } from "@expo/vector-icons"
import FooterLogo from "@/components/FooterLogo"
import HeaderPage from "@/components/HeaderPage"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.75

const AdminArticlesScreen = () => {
  const router = useRouter()
  const [isAddArticleModalVisible, setIsAddArticleModalVisible] = useState(false)
  const [isEditArticleModalVisible, setIsEditArticleModalVisible] = useState(false)
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  
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

  const [categoriesData, setCategoriesData] = useState([
    {
      id: "tech-tools",
      title: "Technologies et Outils",
      articles: [
        {
          id: "1",
          titre_article: "Développement Web",
          description_article: "Formation complète en développement web moderne avec React, Node.js et bases de données",
          datePublication_article: "2024-01-15",
          img_article: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
          auteur_article: "Jean Dupont",
          readTime: "8 min"
        },
        {
          id: "2",
          titre_article: "Base de Données",
          description_article: "Maîtrisez les concepts avancés des bases de données relationnelles et NoSQL",
          datePublication_article: "2024-01-12",
          img_article: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=300&h=200&fit=crop",
          auteur_article: "Marie Martin",
          readTime: "12 min"
        },
      ],
    },
    {
      id: "ai-data",
      title: "Intelligence Artificielle & Data",
      articles: [
        {
          id: "3",
          titre_article: "Machine Learning",
          description_article: "Introduction aux algorithmes d'apprentissage automatique et leurs applications",
          datePublication_article: "2024-01-10",
          img_article: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop",
          auteur_article: "Pierre Durand",
          readTime: "10 min"
        },
      ],
    },
    {
      id: "cybersecurity",
      title: "Cybersécurité",
      articles: [
        {
          id: "4",
          titre_article: "Sécurité Réseau",
          description_article: "Protection des infrastructures réseau et détection d'intrusions",
          datePublication_article: "2024-01-08",
          img_article: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop",
          auteur_article: "Sophie Bernard",
          readTime: "11 min"
        },
      ],
    },
    {
      id: "cloud-infrastructure",
      title: "Cloud Computing et Infrastructures",
      articles: [
        {
          id: "5",
          titre_article: "AWS Solutions",
          description_article: "Services cloud Amazon et architecture scalable",
          datePublication_article: "2024-01-05",
          img_article: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop",
          auteur_article: "Luc Moreau",
          readTime: "17 min"
        },
      ],
    },
    {
      id: "web-mobile",
      title: "Web, Mobile & UX/UI",
      articles: [
        {
          id: "6",
          titre_article: "React Native",
          description_article: "Développement d'applications mobiles cross-platform avec React Native",
          datePublication_article: "2024-01-03",
          img_article: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop",
          auteur_article: "Emma Leroy",
          readTime: "13 min"
        },
      ],
    },
    {
      id: "industrial-tech",
      title: "Technologies industrielles",
      articles: [
        {
          id: "7",
          titre_article: "Industrie 4.0",
          description_article: "Transformation digitale des processus industriels et automatisation",
          datePublication_article: "2024-01-01",
          img_article: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
          auteur_article: "Thomas Roux",
          readTime: "14 min"
        },
      ],
    },
    {
      id: "societal-ethics",
      title: "Enjeux sociétaux, éthiques et environnementaux",
      articles: [
        {
          id: "8",
          titre_article: "IA Éthique",
          description_article: "Développement responsable de l'intelligence artificielle",
          datePublication_article: "2023-12-28",
          img_article: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&h=200&fit=crop",
          auteur_article: "Julie Blanc",
          readTime: "13 min"
        },
      ],
    },
    {
      id: "trends-markets",
      title: "Tendances & Marchés",
      articles: [
        {
          id: "9",
          titre_article: "Fintech",
          description_article: "Innovation financière et technologies de paiement",
          datePublication_article: "2023-12-25",
          img_article: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop",
          auteur_article: "Antoine Petit",
          readTime: "15 min"
        },
      ],
    },
    {
      id: "research-innovation",
      title: "Recherche & Innovation",
      articles: [
        {
          id: "10",
          titre_article: "Quantum Computing",
          description_article: "Informatique quantique et algorithmes révolutionnaires",
          datePublication_article: "2023-12-20",
          img_article: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop",
          auteur_article: "Nicolas Fabre",
          readTime: "18 min"
        },
      ],
    },
  ])

  // Calcul des statistiques
  const totalArticles = categoriesData.reduce((total, category) => total + category.articles.length, 0)
  const totalCategories = categoriesData.length

  const handleArticlePress = (article: any, category: any) => {
    // Naviguer vers la page de détail avec les paramètres nécessaires pour l'administration
    router.push({
      pathname: "/(tabs)/articleadmin/[id]",
      params: {
        id: article.id,
        categoryId: category.id,
        isAdmin: "true", // Convertir en string
        articleTitle: article.titre_article,
        articleDescription: article.description_article,
        articleImage: article.img_article,
        articleAuthor: article.auteur_article,
        articleDate: article.datePublication_article,
        articleReadTime: article.readTime
      },
    })
  }

  const handleAddArticle = () => {
    if (selectedCategory && newArticle.titre_article && newArticle.description_article && newArticle.auteur_article) {
      const updatedCategories = [...categoriesData]
      const categoryIndex = updatedCategories.findIndex((cat) => cat.id === selectedCategory.id)

      if (categoryIndex !== -1) {
        const newId = String(Math.max(...updatedCategories.flatMap(cat => cat.articles.map(a => Number(a.id)))) + 1)

        updatedCategories[categoryIndex].articles.push({
          id: newId,
          titre_article: newArticle.titre_article,
          description_article: newArticle.description_article,
          datePublication_article: newArticle.datePublication_article || new Date().toISOString().split('T')[0],
          img_article: newArticle.img_article || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
          auteur_article: newArticle.auteur_article,
          readTime: "10 min"
        })

        setCategoriesData(updatedCategories)
        setNewArticle({
          titre_article: "",
          description_article: "",
          datePublication_article: "",
          img_article: "",
          auteur_article: "",
        })
        setIsAddArticleModalVisible(false)
        Alert.alert("Succès", "Article ajouté avec succès!")
      }
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires (titre, description, auteur)")
    }
  }

  const handleEditArticle = () => {
    if (selectedCategory && selectedArticle && selectedArticle.titre_article && selectedArticle.description_article) {
      const updatedCategories = [...categoriesData]
      const categoryIndex = updatedCategories.findIndex((cat) => cat.id === selectedCategory.id)

      if (categoryIndex !== -1) {
        const articleIndex = updatedCategories[categoryIndex].articles.findIndex((a) => a.id === selectedArticle.id)

        if (articleIndex !== -1) {
          updatedCategories[categoryIndex].articles[articleIndex] = {
            ...selectedArticle,
          }

          setCategoriesData(updatedCategories)
          setSelectedArticle(null)
          setIsEditArticleModalVisible(false)
          Alert.alert("Succès", "Article modifié avec succès!")
        }
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
        onPress: () => {
          const updatedCategories = [...categoriesData]
          const categoryIndex = updatedCategories.findIndex((cat) => cat.id === categoryId)

          if (categoryIndex !== -1) {
            updatedCategories[categoryIndex].articles = updatedCategories[categoryIndex].articles.filter(
              (a) => a.id !== articleId,
            )
            setCategoriesData(updatedCategories)
            Alert.alert("Succès", "Article supprimé avec succès!")
          }
        },
      },
    ])
  }

  const handleAddCategory = () => {
    if (newCategory.title.trim()) {
      const newId = `category-${Date.now()}`
      const updatedCategories = [...categoriesData, {
        id: newId,
        title: newCategory.title,
        articles: []
      }]
      
      setCategoriesData(updatedCategories)
      setNewCategory({ title: "" })
      setIsAddCategoryModalVisible(false)
      Alert.alert("Succès", "Catégorie ajoutée avec succès!")
    } else {
      Alert.alert("Erreur", "Veuillez saisir un nom de catégorie")
    }
  }

  const ArticleCard = ({ article, category }: { article: any; category: any }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => handleArticlePress(article, category)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: article.img_article }} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle} numberOfLines={2}>{article.titre_article}</Text>
        <Text style={styles.articleDescription} numberOfLines={3}>{article.description_article}</Text>
        <View style={styles.articleFooter}>
          <View style={styles.readTimeInfo}>
            <Ionicons name="time-outline" size={16} color="#64748B" />
            <Text style={styles.readTimeText}>{article.readTime}</Text>
          </View>
          <Text style={styles.authorText}>Par {article.auteur_article}</Text>
        </View>
      </View>

      {/* Admin Controls */}
      <View style={styles.adminControls}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={(e) => {
            e.stopPropagation();
            setSelectedArticle({ ...article })
            setSelectedCategory(category)
            setIsEditArticleModalVisible(true)
          }}
        >
          <Ionicons name="create-outline" size={16} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteArticle(category.id, article.id)
          }}
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  const renderArticlesList = (category: any, delay: number) => (
    <Animated.View entering={FadeInDown.delay(delay)} style={styles.section}>
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
      <FlatList
        data={category.articles}
        renderItem={({ item }) => <ArticleCard article={item} category={category} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      />
    </Animated.View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <HeaderPage title = "Articles"/>
        <TouchableOpacity
          style={styles.addCategoryButton}
          onPress={() => setIsAddCategoryModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

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
          {categoriesData.map((category, index) => 
            renderArticlesList(category, 200 + index * 100)
          )}

        </View>
      </ScrollView>

      <FooterLogo />

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
                onChangeText={(text) => setSelectedArticle({ ...selectedArticle, titre_article: text })}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description de l'article *"
                multiline
                numberOfLines={4}
                value={selectedArticle?.description_article}
                onChangeText={(text) => setSelectedArticle({ ...selectedArticle, description_article: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Auteur de l'article *"
                value={selectedArticle?.auteur_article}
                onChangeText={(text) => setSelectedArticle({ ...selectedArticle, auteur_article: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Date de publication (YYYY-MM-DD)"
                value={selectedArticle?.datePublication_article}
                onChangeText={(text) => setSelectedArticle({ ...selectedArticle, datePublication_article: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="URL de l'image"
                value={selectedArticle?.img_article}
                onChangeText={(text) => setSelectedArticle({ ...selectedArticle, img_article: text })}
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  addCategoryButton: {
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
  adminControls: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 8,
    zIndex: 10,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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