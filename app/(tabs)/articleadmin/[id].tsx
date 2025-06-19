"use client"

import api from "@/api/axiosClient"
import FooterLogo from "@/components/FooterLogo"
import { useSession } from "@/contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState, useCallback, useMemo } from "react"
import {
  ActivityIndicator,
  Alert,
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
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import { useFocusEffect } from "@react-navigation/native"

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

const ArticleDetailAdminScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { user, token } = useSession()

  const [loading, setLoading] = useState(false)
  const [article, setArticle] = useState<Article | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)

  // Récupérer l'ID depuis les paramètres
  const articleId = useMemo(() => {
    return params.id as string
  }, [params.id])

  useFocusEffect(
    useCallback(() => {
      const fetchArticleDetail = async () => {
        if (!articleId) {
          setError("ID de l'article manquant")
          return
        }

        try {
          setLoading(true)
          setError(null)

          // Récupérer tous les articles et trouver celui qui correspond
          const response = await api.get("/article/")
          const rawArticles = response.data

          const currentArticle = rawArticles.find((a: any) => a.Id_article?.toString() === articleId)

          if (currentArticle) {
            const formattedArticle: Article = {
              id: currentArticle.Id_article?.toString() || "",
              titre_article: currentArticle.titre_article ?? "Titre manquant",
              description_article: currentArticle.description_article ?? "Pas de description",
              datePublication_article: currentArticle.datePublication_article
                ? new Date(currentArticle.datePublication_article).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
              img_article:
                currentArticle.img_article ??
                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
              auteur_article: currentArticle.auteur_article ?? "Auteur EPF",
              readTime: currentArticle.readTime ? `${currentArticle.readTime} min` : "5 min",
              categorie: currentArticle.categorie ?? "Autre",
              ID_user: currentArticle.ID_user?.toString() ?? "",
            }

            setArticle(formattedArticle)
          } else {
            // Utiliser les données des paramètres si l'article n'est pas trouvé dans l'API
            const fallbackArticle: Article = {
              id: articleId,
              titre_article: (params.articleTitle as string) ?? "Titre manquant",
              description_article: (params.articleDescription as string) ?? "Pas de description",
              datePublication_article: (params.articleDate as string) ?? new Date().toISOString().split("T")[0],
              img_article:
                (params.articleImage as string) ??
                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
              auteur_article: (params.articleAuthor as string) ?? "Auteur EPF",
              readTime: (params.articleReadTime as string) ?? "5 min",
              categorie: "Autre",
              ID_user: "",
            }
            setArticle(fallbackArticle)
          }
        } catch (err) {
          console.error("Erreur récupération article:", err)
          // En cas d'erreur API, utiliser les données des paramètres
          const fallbackArticle: Article = {
            id: articleId,
            titre_article: (params.articleTitle as string) ?? "Titre manquant",
            description_article: (params.articleDescription as string) ?? "Pas de description",
            datePublication_article: (params.articleDate as string) ?? new Date().toISOString().split("T")[0],
            img_article:
              (params.articleImage as string) ??
              "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
            auteur_article: (params.articleAuthor as string) ?? "Auteur EPF",
            readTime: (params.articleReadTime as string) ?? "5 min",
            categorie: "Autre",
            ID_user: "",
          }
          setArticle(fallbackArticle)
        } finally {
          setLoading(false)
        }
      }

      fetchArticleDetail()
    }, [articleId]),
  )

  const handleEditArticle = async () => {
    if (!article) return

    if (article.titre_article && article.description_article && article.auteur_article) {
      try {
        // Appel API pour modifier l'article dans la base de données
        const articleData = {
          titre_article: article.titre_article,
          description_article: article.description_article,
          datePublication_article: article.datePublication_article,
          img_article: article.img_article,
          auteur_article: article.auteur_article,
          categorie: article.categorie,
          readTime: Number.parseInt(article.readTime.replace(" min", "")) || 5,
        }

        console.log("Modification article:", article.id, articleData)
        const response = await api.put(`/article/${article.id}`, articleData)

        if (response.status === 200) {
          setIsEditModalVisible(false)
          Alert.alert("Succès", "Article modifié avec succès dans la base de données!")
          // Forcer le rafraîchissement des données
          router.back()
        }
      } catch (err) {
        console.error("Erreur modification article:", err)
        Alert.alert("Erreur", "Impossible de modifier l'article dans la base de données")
      }
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires (titre, description, auteur)")
    }
  }

  const handleDeleteArticle = () => {
    if (!article) return

    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer définitivement cet article de la base de données ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer définitivement",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("Suppression article:", article.id)
              const response = await api.delete(`/article/${article.id}`)

              if (response.status === 200 || response.status === 204) {
                Alert.alert("Succès", "Article supprimé définitivement de la base de données!", [
                  { text: "OK", onPress: () => router.back() },
                ])
              }
            } catch (err) {
              console.error("Erreur suppression article:", err)
              Alert.alert("Erreur", "Impossible de supprimer l'article de la base de données")
            }
          },
        },
      ],
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date non spécifiée"

    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    } catch (error) {
      return dateString
    }
  }

  if (loading && !article) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Chargement de l'article...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error || !article) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Article non trouvé"}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header avec image de fond */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: article.img_article }} style={styles.headerImage} />
        <View style={styles.headerOverlay} />

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Animated.View entering={FadeIn.delay(200)} style={styles.articleHeader}>
            <Text style={styles.articleTitle}>{article.titre_article}</Text>

            <View style={styles.articleMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="person-outline" size={16} color="#64748B" />
                <Text style={styles.metaText}>{article.auteur_article}</Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color="#64748B" />
                <Text style={styles.metaText}>{formatDate(article.datePublication_article)}</Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#64748B" />
                <Text style={styles.metaText}>{article.readTime}</Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="folder-outline" size={16} color="#64748B" />
                <Text style={styles.metaText}>{article.categorie}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(300)} style={styles.articleContent}>
            <Text style={styles.articleText}>{article.description_article}</Text>

            {/* Contenu d'exemple pour remplir la page */}
            <Text style={styles.articleText}>
            </Text>
          </Animated.View>

          {/* Actions administrateur */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.adminActions}>
            <Text style={styles.sectionTitle}>Actions administrateur</Text>

            <TouchableOpacity style={styles.actionButton} onPress={() => setIsEditModalVisible(true)}>
              <Ionicons name="create-outline" size={20} color="#3B82F6" />
              <Text style={[styles.actionButtonText, { color: "#3B82F6" }]}>Modifier l'article</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleDeleteArticle}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={[styles.actionButtonText, { color: "#EF4444" }]}>Supprimer l'article</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <FooterLogo />
      </ScrollView>


      {/* Edit Article Modal */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier l'article</Text>

            <ScrollView style={styles.modalScrollView}>
              <TextInput
                style={styles.input}
                placeholder="Titre de l'article *"
                value={article.titre_article}
                onChangeText={(text) => setArticle({ ...article, titre_article: text })}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description de l'article *"
                multiline
                numberOfLines={4}
                value={article.description_article}
                onChangeText={(text) => setArticle({ ...article, description_article: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Auteur de l'article *"
                value={article.auteur_article}
                onChangeText={(text) => setArticle({ ...article, auteur_article: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Date de publication (YYYY-MM-DD)"
                value={article.datePublication_article}
                onChangeText={(text) => setArticle({ ...article, datePublication_article: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="URL de l'image"
                value={article.img_article}
                onChangeText={(text) => setArticle({ ...article, img_article: text })}
              />
            </ScrollView>

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
  headerContainer: {
    height: 250,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  articleHeader: {
    marginBottom: 24,
  },
  articleTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  articleMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#64748B",
  },
  articleContent: {
    marginBottom: 40,
  },
  articleText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#334155",
    marginBottom: 20,
  },
  articleSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
    marginTop: 8,
  },
  adminActions: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
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
    marginBottom: 20,
    color: "#000000",
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

export default ArticleDetailAdminScreen
