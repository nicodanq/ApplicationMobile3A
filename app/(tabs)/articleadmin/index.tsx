"use client"

import FooterLogo from "@/components/FooterLogo"
import HeaderPage from "@/components/HeaderPage"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
    Alert,
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

const AdminArticlesScreen = () => {
  const router = useRouter()
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [newArticle, setNewArticle] = useState({
    title: "",
    description: "",
    category: "",
    iconType: "web",
  })

  const [categoriesData, setCategoriesData] = useState([
    {
      id: "tech-tools",
      title: "Technologies et Outils",
      articles: [
        {
          id: "1",
          title: "Développement Web",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "WEB DEVELOPMENT",
          iconType: "web",
        },
        {
          id: "2",
          title: "Base de Données",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "DATABASE",
          iconType: "database",
        },
        {
          id: "3",
          title: "DevOps",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "DEVOPS",
          iconType: "devops",
        },
      ],
    },
    {
      id: "ai-data",
      title: "Intelligence Artificielle & Data",
      articles: [
        {
          id: "4",
          title: "Machine Learning",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "MACHINE LEARNING",
          iconType: "ai",
        },
        {
          id: "5",
          title: "Data Science",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "DATA SCIENCE",
          iconType: "data",
        },
        {
          id: "6",
          title: "Deep Learning",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "DEEP LEARNING",
          iconType: "neural",
        },
      ],
    },
    {
      id: "cybersecurity",
      title: "Cybersécurité",
      articles: [
        {
          id: "7",
          title: "Sécurité Réseau",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "NETWORK SECURITY",
          iconType: "security",
        },
        {
          id: "8",
          title: "Cryptographie",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "CRYPTOGRAPHY",
          iconType: "crypto",
        },
        {
          id: "9",
          title: "Ethical Hacking",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "ETHICAL HACKING",
          iconType: "hacking",
        },
      ],
    },
    {
      id: "web-mobile",
      title: "Web, Mobile & UX/UI",
      articles: [
        {
          id: "10",
          title: "React Native",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "MOBILE DEV",
          iconType: "mobile",
        },
        {
          id: "11",
          title: "UX Design",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "UX DESIGN",
          iconType: "design",
        },
        {
          id: "12",
          title: "Progressive Web Apps",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "PWA",
          iconType: "pwa",
        },
      ],
    },
  ])

  const handleArticlePress = (article: any) => {
    router.push({
      pathname: "/(tabs)/articles/[id]",
      params: {
        id: article.id,
        articleTitle: article.title,
        articleDescription: article.description,
        articleBackgroundColor: article.backgroundColor,
      },
    })
  }

  const handleAddArticle = () => {
    if (selectedCategory && newArticle.title && newArticle.description) {
      const updatedCategories = [...categoriesData]
      const categoryIndex = updatedCategories.findIndex((cat) => cat.id === selectedCategory.id)

      if (categoryIndex !== -1) {
        const newId = String(Math.max(...updatedCategories[categoryIndex].articles.map((a) => Number(a.id))) + 1)

        updatedCategories[categoryIndex].articles.push({
          id: newId,
          title: newArticle.title,
          description: newArticle.description,
          backgroundColor: "#E3F2FD",
          category: newArticle.category || selectedCategory.title.toUpperCase(),
          iconType: newArticle.iconType || "web",
        })

        setCategoriesData(updatedCategories)
        setNewArticle({ title: "", description: "", category: "", iconType: "web" })
        setIsAddModalVisible(false)
      }
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
    }
  }

  const handleEditArticle = () => {
    if (selectedCategory && selectedArticle && selectedArticle.title && selectedArticle.description) {
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
          setIsEditModalVisible(false)
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
          }
        },
      },
    ])
  }

  const getIconContent = (iconType: string) => {
    const iconMap: { [key: string]: string } = {
      web: "</>",
      database: "DB",
      devops: "⚙️",
      ai: "🤖",
      data: "📊",
      neural: "🧠",
      security: "🔒",
      crypto: "🔐",
      hacking: "💻",
      mobile: "📱",
      design: "🎨",
      pwa: "⚡",
      cloud: "☁️",
      kubernetes: "K8s",
      microservices: "🔗",
      industry: "🏭",
      iot: "📡",
      automation: "🤖",
      ethics: "⚖️",
      green: "🌱",
      social: "👥",
      fintech: "💰",
      ecommerce: "🛒",
      startup: "🚀",
      quantum: "⚛️",
      biotech: "🧬",
      nanotech: "🔬",
      vr: "🥽",
      ar: "👓",
      metaverse: "🌐",
    }
    return iconMap[iconType] || "💻"
  }

  const ArticleCard = ({ article, category }: { article: any; category: any }) => (
    <View style={styles.articleCardContainer}>
      <TouchableOpacity
        style={[styles.articleCard, { backgroundColor: article.backgroundColor }]}
        onPress={() => handleArticlePress(article)}
        activeOpacity={0.7}
      >
        <View style={styles.leftSection}>
          <View style={styles.iconCircle}>
            <View style={styles.decorativeElement1} />
            <View style={styles.decorativeElement2} />
            <View style={styles.decorativeElement3} />
            <View style={styles.decorativeElement4} />
            <View style={styles.decorativeElement5} />

            <View style={styles.centralIcon}>
              <Text style={styles.iconText}>{getIconContent(article.iconType)}</Text>
            </View>
          </View>
          <Text style={styles.categoryText}>{article.category}</Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.articleTitle} numberOfLines={2} ellipsizeMode="tail">
            {article.title}
          </Text>
          <Text style={styles.articleDescription} numberOfLines={3} ellipsizeMode="tail">
            {article.description}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Admin Controls */}
      <View style={styles.adminControls}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setSelectedArticle({ ...article })
            setSelectedCategory(category)
            setIsEditModalVisible(true)
          }}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteArticle(category.id, article.id)}>
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const CategorySection = ({ category }: { category: any }) => (
    <View style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{category.title}</Text>
        <TouchableOpacity
          style={styles.addArticleButton}
          onPress={() => {
            setSelectedCategory(category)
            setIsAddModalVisible(true)
          }}
        >
          <Text style={styles.addArticleButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContainer}
        style={styles.horizontalScroll}
      >
        {category.articles.map((article: any, index: number) => (
          <View
            key={article.id}
            style={[styles.horizontalCardWrapper, index === category.articles.length - 1 && styles.lastCard]}
          >
            <ArticleCard article={article} category={category} />
          </View>
        ))}
      </ScrollView>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header with Add Button */}
      <View style={styles.headerContainer}>
        <HeaderPage title="Articles" />
        <TouchableOpacity
          style={styles.addCategoryButton}
          onPress={() => {
            // Logique pour ajouter une catégorie
            Alert.alert("Fonctionnalité", "Ajout de catégorie à implémenter")
          }}
        >
          <Text style={styles.addCategoryButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {categoriesData.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}

        {/* EPF Projects Logo */}
        <FooterLogo />
      </ScrollView>

      {/* Add Article Modal */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un article</Text>
            <Text style={styles.modalSubtitle}>Catégorie: {selectedCategory?.title}</Text>

            <TextInput
              style={styles.input}
              placeholder="Titre de l'article"
              value={newArticle.title}
              onChangeText={(text) => setNewArticle({ ...newArticle, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description de l'article"
              multiline
              numberOfLines={4}
              value={newArticle.description}
              onChangeText={(text) => setNewArticle({ ...newArticle, description: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Catégorie (optionnel)"
              value={newArticle.category}
              onChangeText={(text) => setNewArticle({ ...newArticle, category: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAddModalVisible(false)}
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
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier l'article</Text>
            <Text style={styles.modalSubtitle}>Catégorie: {selectedCategory?.title}</Text>

            <TextInput
              style={styles.input}
              placeholder="Titre de l'article"
              value={selectedArticle?.title}
              onChangeText={(text) => setSelectedArticle({ ...selectedArticle, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description de l'article"
              multiline
              numberOfLines={4}
              value={selectedArticle?.description}
              onChangeText={(text) => setSelectedArticle({ ...selectedArticle, description: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Catégorie"
              value={selectedArticle?.category}
              onChangeText={(text) => setSelectedArticle({ ...selectedArticle, category: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerContainer: {
    position: "relative",
  },
  addCategoryButton: {
    position: "absolute",
    right: 20,
    top: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  addCategoryButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: -2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categorySection: {
    marginVertical: 15,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addArticleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  addArticleButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: -2,
  },
  horizontalScroll: {
    marginHorizontal: -20,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 20,
    alignItems: "stretch",
  },
  horizontalCardWrapper: {
    width: 280,
    marginRight: 12,
    height: 120,
  },
  lastCard: {
    marginRight: 20,
  },
  articleCardContainer: {
    position: "relative",
    height: 120,
  },
  articleCard: {
    borderRadius: 20,
    padding: 16,
    height: 120,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  adminControls: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    zIndex: 10,
  },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 14,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  deleteButtonText: {
    fontSize: 14,
  },
  leftSection: {
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  rightSection: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: "center",
  },
  iconCircle: {
    width: 70,
    height: 70,
    backgroundColor: "#C8E6C9",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 8,
  },
  centralIcon: {
    width: 40,
    height: 30,
    backgroundColor: "#2d5a3d",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  decorativeElement1: {
    position: "absolute",
    top: 8,
    left: 15,
    width: 4,
    height: 4,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  decorativeElement2: {
    position: "absolute",
    top: 15,
    right: 12,
    width: 6,
    height: 2,
    backgroundColor: "#4CAF50",
  },
  decorativeElement3: {
    position: "absolute",
    bottom: 12,
    left: 8,
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 4,
  },
  decorativeElement4: {
    position: "absolute",
    top: 25,
    left: 5,
    width: 3,
    height: 3,
    backgroundColor: "#4CAF50",
    borderRadius: 1.5,
  },
  decorativeElement5: {
    position: "absolute",
    bottom: 8,
    right: 15,
    width: 5,
    height: 5,
    backgroundColor: "#4CAF50",
    transform: [{ rotate: "45deg" }],
  },
  categoryText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
    height: 40,
    lineHeight: 20,
  },
  articleDescription: {
    fontSize: 11,
    color: "#666",
    lineHeight: 14,
    height: 42,
    overflow: "hidden",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
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
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F1F5F9",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#64748B",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
})

export default AdminArticlesScreen