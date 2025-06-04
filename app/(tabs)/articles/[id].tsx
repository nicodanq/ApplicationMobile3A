import { useLocalSearchParams, useRouter } from "expo-router";
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

const ArticleDetailScreen = () => {
  // const navigation = useNavigation();
  // const route = useRoute();
  // const { title, description } = route.params || {};
  const { id } = useLocalSearchParams()
  const router = useRouter()

  const fullArticleText = `Un récent article de recherche publié dans une revue scientifique internationale explore les effets du changement climatique sur la biodiversité. Les chercheurs ont analysé des données collectées sur plusieurs décennies dans différentes régions du monde. Leur étude montre que l'augmentation des températures et la modification des précipitations ont un impact direct sur les habitats naturels, entraînant la disparition de certaines espèces et le déplacement d'autres vers de nouvelles zones. Cette recherche met en évidence l'urgence d'adopter des politiques environnementales plus strictes pour limiter les effets du réchauffement climatique. Les auteurs soulignent également l'importance de la coopération internationale pour protéger la faune et la flore menacées.`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={router.back}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Titre de l'article {id}</Text>
        <View style={styles.headerLine} />
      </View>

      {/* Article Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Article Image */}
        <View style={styles.articleImageContainer}>
          <View style={styles.scientistIllustration}>
            {/* Scientist character */}
            <View style={styles.scientist}>
              <View style={styles.scientistHead}>
                <View style={styles.hair} />
                <View style={styles.glasses} />
                <View style={styles.face} />
              </View>
              <View style={styles.labCoat} />
              <View style={styles.arm} />
            </View>

            {/* Lab equipment */}
            <View style={styles.labEquipment}>
              <View style={[styles.beaker, { left: 20, backgroundColor: '#ff6b35' }]} />
              <View style={[styles.beaker, { left: 40, backgroundColor: '#4ecdc4' }]} />
              <View style={[styles.testTube, { right: 80, backgroundColor: '#45b7d1' }]} />
              <View style={[styles.testTube, { right: 60, backgroundColor: '#96ceb4' }]} />
              <View style={[styles.microscope, { right: 20 }]} />
            </View>
          </View>
        </View>

        {/* Article Text */}
        <View style={styles.textContainer}>
          <Text style={styles.articleText}>{fullArticleText}</Text>
        </View>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 25,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'left',
    marginLeft: 40,
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
  articleImageContainer: {
    marginVertical: 20,
  },
  scientistIllustration: {
    height: 200,
    backgroundColor: '#4a90e2',
    borderRadius: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  scientist: {
    position: 'absolute',
    left: 50,
    top: 30,
  },
  scientistHead: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  hair: {
    width: 40,
    height: 25,
    backgroundColor: '#ff6b35',
    borderRadius: 20,
    position: 'absolute',
    top: 0,
  },
  glasses: {
    width: 30,
    height: 15,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    position: 'absolute',
    top: 15,
    left: 5,
    backgroundColor: 'transparent',
  },
  face: {
    width: 35,
    height: 30,
    backgroundColor: '#fdbcb4',
    borderRadius: 15,
    position: 'absolute',
    top: 10,
    left: 2.5,
  },
  labCoat: {
    width: 60,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
  },
  arm: {
    width: 20,
    height: 40,
    backgroundColor: '#fdbcb4',
    position: 'absolute',
    right: -15,
    top: 50,
    borderRadius: 10,
  },
  labEquipment: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  beaker: {
    width: 15,
    height: 25,
    borderRadius: 3,
    position: 'absolute',
    bottom: 0,
  },
  testTube: {
    width: 8,
    height: 30,
    borderRadius: 4,
    position: 'absolute',
    bottom: 0,
  },
  microscope: {
    width: 25,
    height: 20,
    backgroundColor: '#666',
    borderRadius: 5,
    position: 'absolute',
    bottom: 0,
  },
  textContainer: {
    marginBottom: 30,
  },
  articleText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
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

export default ArticleDetailScreen;