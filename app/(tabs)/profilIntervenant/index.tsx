import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const ProfileScreen = () => {
  const router = useRouter();


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon profil</Text>
        <View style={styles.headerLine} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            {/* Profile Image */}
            <View style={styles.profileImageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' }}
                style={styles.profileImage}
              />
            </View>
            
            {/* Profile Name */}
            <Text style={styles.profileName}>Lina BENABDELOUAHED</Text>
            <Text style={styles.profileRole}>Étudiante en ingénierie</Text>
            
            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Projets</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Études</Text>
              </View>
            </View>
          </View>
          
          {/* Menu Buttons */}
          <View style={styles.menuContainer}>
            {/* Informations Button */}
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => router.push('/(tabs)/profilIntervenant/informations')}
              activeOpacity={0.8}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="person-outline" size={22} color="#2196F3" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Mes informations</Text>
                <Text style={styles.menuSubtext}>Profil, coordonnées, préférences</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
            
            {/* Études Button */}
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => router.push('/(tabs)/profilIntervenant/etudes')}
              activeOpacity={0.8}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="school-outline" size={22} color="#4CAF50" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Mes études</Text>
                <Text style={styles.menuSubtext}>Parcours, formations, certifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
            
            {/* Paramètres Button */}
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => router.push('/(tabs)/profilIntervenant/parametres')}
              activeOpacity={0.8}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="settings-outline" size={22} color="#E91E63" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Paramètres</Text>
                <Text style={styles.menuSubtext}>Confidentialité, notifications, sécurité</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 5,
  },
  headerLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 24,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  menuContainer: {
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
    marginBottom: 24,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: 13,
    color: '#64748B',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  versionText: {
    fontSize: 14,
    color: '#94A3B8',
  },
});

export default ProfileScreen;