
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ArticleDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { articleTitle, articleDescription, articleTitleColor, articleBackgroundColor } = params;

  // Images pour chaque type d'article
  const getArticleImage = (title: string) => {
    const images: { [key: string]: string } = {
      'IT & Digital': 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop',
      'Ingénierie des Systèmes': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop',
      'Conseil': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
      'Traduction technique': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
    };
    
    return images[title as string] || 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop';
  };

const getArticleContent = (title: string) => {
  const articles: { [key: string]: any } = {
    'IT & Digital': {
      category: 'Technologie : IT & Digital',
      fullTitle: 'L\'évolution des technologies numériques en 2024',
      fullDescription: `Les technologies numériques continuent d'évoluer à un rythme effréné. Cet article explore les dernières tendances en matière d'intelligence artificielle, de développement web, de cybersécurité et d'innovation technologique. Découvrez comment ces avancées transforment notre façon de travailler et d'interagir avec le monde numérique.`,
      author: 'Jean Dupont'
    },
    'Ingénierie des Systèmes': {
      category: 'Innovation : Ingénierie des Systèmes',
      fullTitle: 'Les défis de l\'ingénierie des systèmes complexes',
      fullDescription: `L'ingénierie des systèmes fait face à des défis croissants avec la complexification des infrastructures modernes. Cet article analyse les méthodologies innovantes pour concevoir, développer et maintenir des systèmes robustes dans les secteurs de l'aéronautique, de l'automobile et de l'énergie.`,
      author: 'Marie Lambert'
    },
    'Conseil': {
      category: 'Stratégie : Conseil',
      fullTitle: 'Stratégies de transformation digitale en entreprise',
      fullDescription: `La transformation digitale est devenue un enjeu majeur pour les entreprises. Cet article présente les meilleures pratiques en matière de conseil stratégique, d'accompagnement au changement et de management d'équipe dans un contexte de digitalisation accélérée.`,
      author: 'Sophie Martin'
    },
    'Traduction technique': {
      category: 'Linguistique : Traduction technique',
      fullTitle: 'L\'art de la traduction technique à l\'ère numérique',
      fullDescription: `La traduction technique évolue avec les nouvelles technologies. Cet article explore les défis et opportunités de la traduction de documents techniques, scientifiques et industriels, en mettant l'accent sur l'importance de la précision et de l'expertise sectorielle.`,
      author: 'Pierre Leroy'
    }
  };
  
  return articles[title] || {
    category: title || 'Catégorie',
    fullTitle: title || 'Titre de l\'article',
    fullDescription: articleDescription || 'Description de l\'article',
    author: 'Auteur inconnu'
  };
};

  const titleString = Array.isArray(articleTitle) ? articleTitle[0] : articleTitle || '';
  const articleContent = getArticleContent(titleString);
  const categoryColor = Array.isArray(articleTitleColor) ? articleTitleColor[0] : articleTitleColor || '#2196F3';
  const bgColor = Array.isArray(articleBackgroundColor) ? articleBackgroundColor[0] : articleBackgroundColor || '#E3F2FD';
  const articleImage = getArticleImage(titleString);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail de l&apos;article</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Main Card */}
          <View style={styles.mainCard}>
            {/* Image */}
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: articleImage }}
                style={styles.headerImage}
              />
              <View style={styles.imageOverlay} />
              
              {/* Category Badge */}
              <View style={[styles.categoryBadge, { backgroundColor: bgColor }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {articleContent.category}
                </Text>
              </View>
            </View>
            
            {/* Title and Description */}
            <View style={styles.contentSection}>
              <Text style={styles.articleTitle}>
                {articleContent.fullTitle}
              </Text>
              
              {/* Author */}
              <View style={styles.authorSection}>
                <Icon name="person-outline" size={16} color="#64748B" />
                <Text style={styles.authorText}>Par {articleContent.author}</Text>
              </View>
              
              <Text style={styles.articleDescription}>
                {articleContent.fullDescription}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentSection: {
    padding: 20,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
    lineHeight: 32,
  },
  articleDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#64748B',
    textAlign: 'justify',
  },
  backgroundImage: {
    height: '35%',  // Changé de '30%' à '35%' pour correspondre à l'image
    width: '100%',
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -80,  // Changé de -50 à -80 pour que la carte blanche occupe plus d'espace
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  authorText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
    fontStyle: 'italic',
  },
});

export default ArticleDetailScreen;