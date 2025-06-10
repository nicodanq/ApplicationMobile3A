"use client"

import FooterLogo from "@/components/FooterLogo"
import HeaderPage from "@/components/HeaderPage"
import { useRouter } from "expo-router"
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"

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
    {
      id: "cloud-infrastructure",
      title: "Cloud Computing et Infrastructures",
      articles: [
        {
          id: "13",
          title: "AWS Solutions",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "CLOUD COMPUTING",
          iconType: "cloud",
        },
        {
          id: "14",
          title: "Kubernetes",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "KUBERNETES",
          iconType: "kubernetes",
        },
        {
          id: "15",
          title: "Microservices",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "MICROSERVICES",
          iconType: "microservices",
        },
      ],
    },
    {
      id: "industrial-iot",
      title: "Technologies industrielles / IoT",
      articles: [
        {
          id: "16",
          title: "Industrie 4.0",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "INDUSTRY 4.0",
          iconType: "industry",
        },
        {
          id: "17",
          title: "Capteurs IoT",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "IOT SENSORS",
          iconType: "iot",
        },
        {
          id: "18",
          title: "Automatisation",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "AUTOMATION",
          iconType: "automation",
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
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "AI ETHICS",
          iconType: "ethics",
        },
        {
          id: "20",
          title: "Green IT",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "GREEN TECH",
          iconType: "green",
        },
        {
          id: "21",
          title: "Impact Social",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "SOCIAL IMPACT",
          iconType: "social",
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
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "FINTECH",
          iconType: "fintech",
        },
        {
          id: "23",
          title: "E-commerce",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "E-COMMERCE",
          iconType: "ecommerce",
        },
        {
          id: "24",
          title: "Startup Ecosystem",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "STARTUP",
          iconType: "startup",
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
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "QUANTUM",
          iconType: "quantum",
        },
        {
          id: "26",
          title: "Biotechnologies",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "BIOTECH",
          iconType: "biotech",
        },
        {
          id: "27",
          title: "Nanotechnologies",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "NANOTECH",
          iconType: "nanotech",
        },
      ],
    },
    {
      id: "immersive-media",
      title: "Technologies immersives & médias",
      articles: [
        {
          id: "28",
          title: "Réalité Virtuelle",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "VIRTUAL REALITY",
          iconType: "vr",
        },
        {
          id: "29",
          title: "Réalité Augmentée",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "AUGMENTED REALITY",
          iconType: "ar",
        },
        {
          id: "30",
          title: "Métaverse",
          description: "Cet article parle des sciences ou au sein des soci étés babla blabla blablabla blablabla",
          backgroundColor: "#E3F2FD",
          category: "METAVERSE",
          iconType: "metaverse",
        },
      ],
    },
  ]

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

  const ArticleCard = ({ article }: { article: any }) => (
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
  )

  const CategorySection = ({ category }: { category: any }) => (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{category.title}</Text>
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
            <ArticleCard article={article} />
          </View>
        ))}
      </ScrollView>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <HeaderPage title="Articles" />

      {/* Categories List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {categoriesData.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}

        {/* EPF Projects Logo */}
        < FooterLogo/>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categorySection: {
    marginVertical: 15,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  horizontalScroll: {
    marginHorizontal: -20, // Compensate for parent padding
  },
  horizontalScrollContainer: {
    paddingHorizontal: 20,
    alignItems: "stretch",
  },
  horizontalCardWrapper: {
    width: 280, // Plus large pour le nouveau format
    marginRight: 12,
    height: 120,
  },
  lastCard: {
    marginRight: 20, // Extra margin for the last card
  },
  articleCard: {
    borderRadius: 20,
    padding: 16,
    height: 120,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
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
    height: 40, // Hauteur fixe pour tous les titres
    lineHeight: 20, // Hauteur de ligne pour permettre 2 lignes max
  },
  articleDescription: {
    fontSize: 11,
    color: "#666",
    lineHeight: 14,
    height: 42, // Hauteur réduite pour compenser la hauteur fixe du titre
    overflow: "hidden", // Cache le texte qui dépasse
  },
  logoSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  epfLogo: {
    alignItems: "center",
  },
  curvedArrow: {
    backgroundColor: "#4A90A4",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
})


export default ArticlesScreen

