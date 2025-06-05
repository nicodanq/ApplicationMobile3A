import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ArticlesScreen = () => {
  const router = useRouter();

  const articlesData = [
    {
      id: '1',
      title: 'IT & Digital',
      description: 'Formation complète en technologies numériques et développement informatique',
      backgroundColor: '#E3F2FD',
      titleColor: '#2196F3',
      linkColor: '#2196F3'
    },
    {
      id: '2',
      title: 'Ingénierie des Systèmes',
      description: 'Conception et optimisation de systèmes complexes industriels',
      backgroundColor: '#E8F5E8',
      titleColor: '#4CAF50',
      linkColor: '#4CAF50'
    },
    {
      id: '3',
      title: 'Conseil',
      description: 'Stratégie d\'entreprise et accompagnement organisationnel',
      backgroundColor: '#FCE4EC',
      titleColor: '#E91E63',
      linkColor: '#E91E63'
    },
    {
      id: '4',
      title: 'Traduction technique',
      description: 'Spécialisation en traduction de documents techniques et scientifiques',
      backgroundColor: '#E1F5FE',
      titleColor: '#00BCD4',
      linkColor: '#00BCD4'
    }
  ];


  const handleArticlePress = (article: any) => {
    // ✅ Correction : Ajouter l'id obligatoire
    router.push({
      pathname: '/(tabs)/articles/[id]',
      params: {
        id: article.id, // ← ID obligatoire ajouté
        articleTitle: article.title,
        articleDescription: article.description,
        articleTitleColor: article.titleColor,
        articleBackgroundColor: article.backgroundColor
      }
    });
  };

  const ArticleCard = ({ article }: { article: any }) => (
    <TouchableOpacity 
      style={[styles.articleCard, { backgroundColor: article.backgroundColor }]}
      onPress={() => handleArticlePress(article)}

      activeOpacity={0.7}
    >
      <View style={styles.logoContainer}>
        <View style={styles.spiralIcon}>
          <View style={styles.spiralInner} />
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.articleTitle, { color: article.titleColor }]}>
          {article.title}
        </Text>
        <Text style={styles.articleDescription}>
          {article.description}
        </Text>
        <Text style={[styles.learnMore, { color: article.linkColor }]}>
          En savoir plus →
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Articles</Text>
        <View style={styles.headerLine} />
      </View>

      {/* Articles List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {articlesData.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  headerLine: {
    width: '90%',
    height: 1,
    backgroundColor: '#ddd',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  articleCard: {
    flexDirection: 'row',
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  spiralIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#4A90A4',
    position: 'relative',
    overflow: 'hidden',
  },
  spiralInner: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#7BB3C0',
    transform: [{ rotate: '45deg' }],
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  articleDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  learnMore: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ArticlesScreen;