"use client"


import { useLocalSearchParams, useRouter } from "expo-router"
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
} from "react-native"

const { width } = Dimensions.get("window")

const ArticleDetailScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()


  const { articleTitle, articleDescription, articleTitleColor, articleBackgroundColor, id } = params


  // Images améliorées pour chaque type d'article
  const getArticleImage = (title: string) => {
    const images: { [key: string]: string } = {
      "Développement Web": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
      "Base de Données": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
      DevOps: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop",
      "Machine Learning": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
      "Data Science": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      "Deep Learning": "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&h=400&fit=crop",
      "Sécurité Réseau": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
      Cryptographie: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=400&fit=crop",
      "Ethical Hacking": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
      "React Native": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop",
      "UX Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
      "Progressive Web Apps": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    }

    return (
      images[title as string] || "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop"
    )
  }

  const getArticleContent = (title: string) => {
    const articles: { [key: string]: any } = {
      "Développement Web": {
        category: "Technologies et Outils",
        fullTitle: "Les dernières tendances du développement web moderne",
        fullDescription: `Le développement web évolue constamment avec l'émergence de nouvelles technologies et frameworks. Cet article explore les tendances actuelles comme les Progressive Web Apps, le JAMstack, et les architectures serverless. Nous analysons également l'impact de l'intelligence artificielle sur le développement web et comment les développeurs peuvent s'adapter à ces changements rapides pour créer des applications plus performantes et accessibles.`,
        author: "Alexandre Dubois",
        readTime: "8 min",
        publishDate: "15 janvier 2024",
        tags: ["JavaScript", "React", "Performance"],
      },
      "Base de Données": {
        category: "Technologies et Outils",
        fullTitle: "Optimisation des bases de données pour les applications modernes",
        fullDescription: `L'optimisation des bases de données est cruciale pour les performances des applications modernes. Cet article détaille les meilleures pratiques pour structurer, indexer et optimiser vos bases de données. Nous couvrons les différences entre SQL et NoSQL, les stratégies de mise en cache, et les techniques de partitionnement pour gérer de gros volumes de données efficacement.`,
        author: "Marie Lefevre",
        readTime: "12 min",
        publishDate: "12 janvier 2024",
        tags: ["SQL", "NoSQL", "Performance"],
      },
      "Machine Learning": {
        category: "Intelligence Artificielle & Data",
        fullTitle: "Introduction pratique au Machine Learning",
        fullDescription: `Le Machine Learning transforme la façon dont nous analysons les données et prenons des décisions. Cet article propose une approche pratique pour comprendre les algorithmes fondamentaux, de la régression linéaire aux réseaux de neurones. Nous explorons également les outils populaires comme TensorFlow et scikit-learn, avec des exemples concrets d'implémentation.`,
        author: "Dr. Sophie Martin",
        readTime: "15 min",
        publishDate: "10 janvier 2024",
        tags: ["Python", "TensorFlow", "Algorithmes"],
      },
      "Sécurité Réseau": {
        category: "Cybersécurité",
        fullTitle: "Sécuriser son infrastructure réseau en 2024",
        fullDescription: `La sécurité réseau est plus critique que jamais avec l'augmentation des cyberattaques. Cet article présente les meilleures pratiques pour sécuriser votre infrastructure, incluant la segmentation réseau, les firewalls nouvelle génération, et la détection d'intrusions. Nous abordons également les défis spécifiques du télétravail et du cloud computing.`,
        author: "Thomas Rousseau",
        readTime: "10 min",
        publishDate: "8 janvier 2024",
        tags: ["Sécurité", "Réseau", "Firewall"],
      },
    }

    return (
      articles[title] || {
        category: title || "Catégorie",
        fullTitle: title || "Titre de l'article",
        fullDescription:
          articleDescription ||
          "Découvrez les dernières innovations et tendances dans ce domaine passionnant. Cet article explore en profondeur les concepts clés et fournit des insights pratiques pour les professionnels et les étudiants.",
        author: "Expert EPF",
        readTime: "5 min",
        publishDate: "Aujourd'hui",
        tags: ["Innovation", "Technologie"],
      }
    )
  }

  const titleString = Array.isArray(articleTitle) ? articleTitle[0] : articleTitle || ""
  const articleContent = getArticleContent(titleString)
  const categoryColor = Array.isArray(articleTitleColor) ? articleTitleColor[0] : articleTitleColor || "#2196F3"
  const bgColor = Array.isArray(articleBackgroundColor)
    ? articleBackgroundColor[0]
    : articleBackgroundColor || "#E3F2FD"
  const articleImage = getArticleImage(titleString)

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
              <Image source={{ uri: articleImage }} style={styles.headerImage} />
              <View style={styles.imageOverlay} />

              {/* Category Badge */}
              <View style={[styles.categoryBadge, { backgroundColor: bgColor }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>{articleContent.category}</Text>
              </View>

              {/* Reading time badge */}
              <View style={styles.readTimeBadge}>
                <Text style={styles.readTimeText}>📖 {articleContent.readTime}</Text>
              </View>
            </View>

            {/* Title and Description */}
            <View style={styles.contentSection}>
              <Text style={styles.articleTitle}>{articleContent.fullTitle}</Text>

              {/* Meta information */}
              <View style={styles.metaSection}>
                <View style={styles.authorSection}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.avatarText}>{articleContent.author.charAt(0)}</Text>
                  </View>
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorText}>{articleContent.author}</Text>
                    <Text style={styles.publishDate}>{articleContent.publishDate}</Text>
                  </View>
                </View>
              </View>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                {articleContent.tags.map((tag: string, index: number) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.articleDescription}>{articleContent.fullDescription}</Text>

              {/* Action buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.likeButton}>
                  <Text style={styles.actionIcon}>👍</Text>
                  <Text style={styles.actionText}>J'aime</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookmarkButton}>
                  <Text style={styles.actionIcon}>🔖</Text>
                  <Text style={styles.actionText}>Sauvegarder</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButtonAction}>
                  <Text style={styles.actionIcon}>📤</Text>
                  <Text style={styles.actionText}>Partager</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Related articles section */}
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Articles similaires</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={styles.relatedCard}>
                <View style={styles.relatedImage} />
                <Text style={styles.relatedCardTitle}>Article connexe 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.relatedCard}>
                <View style={styles.relatedImage} />
                <Text style={styles.relatedCardTitle}>Article connexe 2</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
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
  relatedSection: {
    marginTop: 20,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  relatedCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  relatedImage: {
    width: "100%",
    height: 80,
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    marginBottom: 8,
  },
  relatedCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
})

export default ArticleDetailScreen