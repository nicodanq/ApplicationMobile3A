"use client"

import { Ionicons } from "@expo/vector-icons"
import FooterLogo from "@/components/FooterLogo"
import HeaderPage from "@/components/HeaderPage"
import { useRouter } from "expo-router"
import { 
  Dimensions, 
  FlatList, 
  Image, 
  SafeAreaView, 
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
  const router = useRouter()

  const categoriesData = [
    {
      id: "tech-tools",
      title: "Technologies et Outils",
      articles: [
        {
          id: "1",
          title: "Développement Web",
          description: "Formation complète en développement web moderne avec React, Node.js et bases de données",
          category: "WEB DEVELOPMENT",
          image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
          readTime: "8 min"
        },
        {
          id: "2",
          title: "Base de Données",
          description: "Maîtrisez les concepts avancés des bases de données relationnelles et NoSQL",
          category: "DATABASE",
          image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=300&h=200&fit=crop",
          readTime: "12 min"
        },
        {
          id: "3",
          title: "DevOps",
          description: "Automatisation et déploiement continu avec Docker, Kubernetes et CI/CD",
          category: "DEVOPS",
          image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=300&h=200&fit=crop",
          readTime: "15 min"
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
          description: "Introduction aux algorithmes d'apprentissage automatique et leurs applications",
          category: "MACHINE LEARNING",
          image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop",
          readTime: "10 min"
        },
        {
          id: "5",
          title: "Data Science",
          description: "Analyse de données avec Python, pandas et visualisation avancée",
          category: "DATA SCIENCE",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
          readTime: "14 min"
        },
        {
          id: "6",
          title: "Deep Learning",
          description: "Réseaux de neurones profonds et intelligence artificielle avancée",
          category: "DEEP LEARNING",
          image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=300&h=200&fit=crop",
          readTime: "18 min"
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
          description: "Protection des infrastructures réseau et détection d'intrusions",
          category: "NETWORK SECURITY",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop",
          readTime: "11 min"
        },
        {
          id: "8",
          title: "Cryptographie",
          description: "Algorithmes de chiffrement et sécurisation des communications",
          category: "CRYPTOGRAPHY",
          image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=300&h=200&fit=crop",
          readTime: "16 min"
        },
        {
          id: "9",
          title: "Ethical Hacking",
          description: "Tests de pénétration et audit de sécurité informatique",
          category: "ETHICAL HACKING",
          image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop",
          readTime: "20 min"
        },
      ],
    },
    {
      id: "cloud-infrastructure",
      title: "Cloud Computing et Infrastructures",
      articles: [
        {
          id: "10",
          title: "AWS Solutions",
          description: "Services cloud Amazon et architecture scalable",
          category: "CLOUD COMPUTING",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop",
          readTime: "17 min"
        },
        {
          id: "11",
          title: "Kubernetes",
          description: "Orchestration de conteneurs et déploiement à grande échelle",
          category: "KUBERNETES",
          image: "https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?w=300&h=200&fit=crop",
          readTime: "22 min"
        },
        {
          id: "12",
          title: "Microservices",
          description: "Architecture microservices et communication inter-services",
          category: "MICROSERVICES",
          image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=200&fit=crop",
          readTime: "19 min"
        },
      ],
    },
    {
      id: "web-mobile",
      title: "Web, Mobile & UX/UI",
      articles: [
        {
          id: "13",
          title: "React Native",
          description: "Développement d'applications mobiles cross-platform avec React Native",
          category: "MOBILE DEV",
          image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop",
          readTime: "13 min"
        },
        {
          id: "14",
          title: "UX Design",
          description: "Conception d'expériences utilisateur et interfaces intuitives",
          category: "UX DESIGN",
          image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop",
          readTime: "9 min"
        },
        {
          id: "15",
          title: "Progressive Web Apps",
          description: "Applications web progressives et technologies modernes du web",
          category: "PWA",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
          readTime: "12 min"
        },
      ],
    },
    {
      id: "industrial-tech",
      title: "Technologies industrielles",
      articles: [
        {
          id: "16",
          title: "Industrie 4.0",
          description: "Transformation digitale des processus industriels et automatisation",
          category: "INDUSTRY 4.0",
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
          readTime: "14 min"
        },
        {
          id: "17",
          title: "Capteurs IoT",
          description: "Internet des objets et capteurs intelligents pour l'industrie",
          category: "IOT SENSORS",
          image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
          readTime: "11 min"
        },
        {
          id: "18",
          title: "Automatisation",
          description: "Robotique industrielle et systèmes automatisés",
          category: "AUTOMATION",
          image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop",
          readTime: "16 min"
        },
      ],
    },
    {
      id: "societal-ethics",
      title: "Enjeux sociétaux, éthiques et environnementaux",
      articles: [
        {
          id: "19",
          title: "IA Éthique",
          description: "Développement responsable de l'intelligence artificielle",
          category: "AI ETHICS",
          image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&h=200&fit=crop",
          readTime: "13 min"
        },
        {
          id: "20",
          title: "Green IT",
          description: "Technologies vertes et informatique durable",
          category: "GREEN TECH",
          image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop",
          readTime: "10 min"
        },
        {
          id: "21",
          title: "Impact Social",
          description: "Technologies au service de l'inclusion et du développement social",
          category: "SOCIAL IMPACT",
          image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=200&fit=crop",
          readTime: "12 min"
        },
      ],
    },
    {
      id: "trends-markets",
      title: "Tendances & Marchés",
      articles: [
        {
          id: "22",
          title: "Fintech",
          description: "Innovation financière et technologies de paiement",
          category: "FINTECH",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop",
          readTime: "15 min"
        },
        {
          id: "23",
          title: "E-commerce",
          description: "Commerce électronique et plateformes digitales",
          category: "E-COMMERCE",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
          readTime: "11 min"
        },
        {
          id: "24",
          title: "Startup Ecosystem",
          description: "Écosystème entrepreneurial et innovation technologique",
          category: "STARTUP",
          image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=200&fit=crop",
          readTime: "14 min"
        },
      ],
    },
    {
      id: "research-innovation",
      title: "Recherche & Innovation",
      articles: [
        {
          id: "25",
          title: "Quantum Computing",
          description: "Informatique quantique et algorithmes révolutionnaires",
          category: "QUANTUM",
          image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop",
          readTime: "18 min"
        },
        {
          id: "26",
          title: "Biotechnologies",
          description: "Convergence entre biologie et technologies numériques",
          category: "BIOTECH",
          image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=300&h=200&fit=crop",
          readTime: "16 min"
        },
        {
          id: "27",
          title: "Nanotechnologies",
          description: "Manipulation de la matière à l'échelle nanométrique",
          category: "NANOTECH",
          image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=300&h=200&fit=crop",
          readTime: "20 min"
        },
      ],
    },
  ]

  // Calcul des statistiques
  const totalArticles = categoriesData.reduce((total, category) => total + category.articles.length, 0)
  const totalCategories = categoriesData.length
  const totalReadTime = categoriesData.reduce((total, category) => 
    total + category.articles.reduce((catTotal, article) => 
      catTotal + parseInt(article.readTime), 0), 0)

  const handleArticlePress = (article: any) => {
    router.push({
      pathname: "/(tabs)/articles/[id]",
      params: {
        id: article.id,
        articleTitle: article.title,
        articleDescription: article.description,
      },
    })
  }

  const ArticleCard = ({ article }: { article: any }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => handleArticlePress(article)}
      activeOpacity={0.7}
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
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderArticlesList = (category: any, delay: number) => (
    <Animated.View entering={FadeInDown.delay(delay)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{category.title}</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <HeaderPage title = "Articles"/>

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
          {categoriesData.map((category, index) => 
            renderArticlesList(category, 200 + index * 100)
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
    alignItems: "center",
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