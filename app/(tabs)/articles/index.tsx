// import { useNavigation } from '@react-navigation/native';
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
import Icon from 'react-native-vector-icons/Ionicons';

const ArticlesScreen = () => {
  // const navigation = useNavigation();
  const router = useRouter()
  const articlesData = [
    {
      id: '1',
      title: 'Changement Climatique et Biodiversité',
      description: 'Cet article parle des sciences au sein des sociétés blabla blablabla ablablab labala blabla bla blab lablablab'
    },
    {
      id: '2',
      title: 'Innovation Technologique',
      description: 'Cet article parle des sciences au sein des sociétés blabla blablabla ablablab labala blabla bla blab lablablab'
    },
    {
      id: '3',
      title: 'Recherche Médicale',
      description: 'Cet article parle des sciences au sein des sociétés blabla blablabla ablablab labala blabla bla blab lablablab'
    }
  ];
  type Article = {
    id: string;
    title: string;
    description: string;
  };

  const handleArticlePress = (article: string) => {
    router.push({
      pathname: "/(tabs)/articles/[id]",
      params: { id: article },
    })
  };

  const ArticleCard = ({ article }: { article: Article }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => handleArticlePress(article.title)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <View style={styles.imageBackground}>
          <View style={styles.chalkboard}>
            <Text style={styles.formula}>E=mc²</Text>
          </View>
          <Text style={styles.imageLabel}>SCIENCE EDUCATION</Text>
          {/* Decorative elements */}
          <View style={[styles.star, { top: 10, left: 15 }]}>
            <Text>✦</Text>
          </View>
          <View style={[styles.star, { top: 20, right: 20 }]}>
            <Text>+</Text>
          </View>
          <View style={[styles.star, { bottom: 30, left: 10 }]}>
            <Text>×</Text>
          </View>
          <View style={[styles.star, { bottom: 15, right: 15 }]}>
            <Text>○</Text>
          </View>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.articleTitle}>{article.title}</Text>
        <Text style={styles.articleDescription}>{article.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

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

      {/* EPF Projects Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>🌀 EPF Projets</Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Icon name="person-outline" size={24} color="#fff" />
        <Icon name="settings-outline" size={24} color="#fff" />
        <Icon name="home-outline" size={24} color="#fff" />
        <Icon name="document-outline" size={24} color="#fff" />
        <Icon name="star-outline" size={24} color="#fff" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  headerLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#e8f0f5',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    marginRight: 15,
  },
  imageBackground: {
    width: 80,
    height: 80,
    backgroundColor: '#c8e6c9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chalkboard: {
    width: 50,
    height: 35,
    backgroundColor: '#2e7d32',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8d6e63',
  },
  formula: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageLabel: {
    position: 'absolute',
    bottom: 5,
    fontSize: 8,
    color: '#666',
    fontWeight: 'bold',
  },
  star: {
    position: 'absolute',
    fontSize: 12,
    color: '#666',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5f7c8a',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#5f7c8a',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default ArticlesScreen;
