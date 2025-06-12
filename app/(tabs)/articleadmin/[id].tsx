"use client"

import FooterLogo from "@/components/FooterLogo"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import {
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
import Animated, { FadeIn } from "react-native-reanimated"

const ArticleDetailScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  
  const [article, setArticle] = useState({
    id: params.id as string,
    titre_article: params.articleTitle as string,
    description_article: params.articleDescription as string,
    datePublication_article: params.articleDate as string,
    img_article: params.articleImage as string,
    auteur_article: params.articleAuthor as string,
    readTime: params.articleReadTime as string,
  })

  const [categoryId, setCategoryId] = useState(params.categoryId as string)

  const handleEditArticle = () => {
    if (article.titre_article && article.description_article) {
      // Ici, vous pourriez implémenter la logique pour mettre à jour l'article dans votre base de données
      // Pour l'instant, nous allons simplement fermer le modal et afficher un message de succès
      setIsEditModalVisible(false)
      Alert.alert("Succès", "Article modifié avec succès!")
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
    }
  }

  const handleDeleteArticle = () => {
    Alert.alert("Confirmation", "Êtes-vous sûr de vouloir supprimer cet article ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          // Ici, vous pourriez implémenter la logique pour supprimer l'article de votre base de données
          // Pour l'instant, nous allons simplement retourner à la page précédente
          router.back()
          Alert.alert("Succès", "Article supprimé avec succès!")
        },
      },
    ])
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date non spécifiée";
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header avec image de fond */}
      <View style={styles.headerContainer}>
        <Image 
          source={{ uri: article.img_article }} 
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay} />
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Admin Controls */}
        <View style={styles.adminControls}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteArticle}
          >
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(300)} style={styles.articleContent}>
            <Text style={styles.articleText}>
              {article.description_article}
            </Text>
            
            {/* Contenu d'exemple pour remplir la page */}
            <Text style={styles.articleText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.
            </Text>
            
            <Text style={styles.articleSubtitle}>
              Points clés à retenir
            </Text>
            
            <Text style={styles.articleText}>
              • Vestibulum auctor dapibus neque.{"\n"}
              • Nunc dignissim risus id metus.{"\n"}
              • Cras ornare tristique elit.{"\n"}
              • Vivamus vestibulum ntulla nec ante.{"\n"}
              • Praesent placerat risus quis eros.
            </Text>
            
            <Text style={styles.articleText}>
              Fusce sagittis, libero non molestie mollis, magna orci ultrices dolor, at vulputate neque nulla lacinia eros. Sed id ligula quis est convallis tempor. Curabitur lacinia pulvinar nibh. Nam a sapien.
            </Text>
          </Animated.View>
        </View>
      </ScrollView>

      <FooterLogo />

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
  adminControls: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59, 130, 246, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(239, 68, 68, 0.8)",
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

export default ArticleDetailScreen