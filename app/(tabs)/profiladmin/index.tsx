"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
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
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"

import FooterLogo from "@/components/FooterLogo"
import HeaderPage from "@/components/HeaderPage"

const { width } = Dimensions.get("window")

// Données fictives pour l'administrateur
const adminData = {
  name: "Admin Système",
  email: "admin@plateforme.com",
  role: "Administrateur",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  stats: {
    users: 156,
    formations: 24,
    events: 12
  }
}

const ProfilAdminScreen = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header simple */}
      
      <HeaderPage title = "Profil"/>
     

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          
          {/* Profil Section */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: adminData.avatar }} style={styles.avatar} />
            </View>
            <Text style={styles.email}>{adminData.email}</Text>
            <Text style={styles.role}>{adminData.role}</Text>
          </Animated.View>

          {/* Stats Section */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{adminData.stats.users}</Text>
              <Text style={styles.statLabel}>Utilisateurs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{adminData.stats.formations}</Text>
              <Text style={styles.statLabel}>Formations</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{adminData.stats.events}</Text>
              <Text style={styles.statLabel}>Événements</Text>
            </View>
          </Animated.View>

          {/* Menu Items - Navigation directe */}
          <View style={styles.menuContainer}>
            <Animated.View entering={FadeInDown.delay(300)}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/(tabs)/profiladmin/information_admin')}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <View style={[styles.iconContainer, { backgroundColor: '#EBF4FF' }]}>
                    <Ionicons name="person-outline" size={24} color="#3B82F6" />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>Mes informations</Text>
                    <Text style={styles.menuSubtitle}>Profil, coordonnées, préférences</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400)}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/(tabs)/profiladmin/parametres')}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <View style={[styles.iconContainer, { backgroundColor: '#FDF2F8' }]}>
                    <Ionicons name="settings-outline" size={24} color="#EC4899" />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>Paramètres</Text>
                    <Text style={styles.menuSubtitle}>Confidentialité, notifications, sécurité</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Admin Info Card */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.adminInfoCard}>
            <View style={styles.adminInfoIcon}>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            </View>
            <Text style={styles.adminInfoTitle}>Accès Administrateur</Text>
            <Text style={styles.adminInfoText}>
              Vous avez accès à toutes les fonctionnalités d&apos;administration de la plateforme.
            </Text>
          </Animated.View>

          {/* Bouton d'action rapide */}
          <Animated.View entering={FadeInDown.delay(700)} style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: '#3B82F6' }]}
              onPress={() => router.push('/(tabs)/profiladmin/liste_utilisateurs')}
            >
              <Ionicons name="people" size={20} color="white" />
              <Text style={styles.quickActionText}>Gérer les utilisateurs</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </ScrollView>

      <FooterLogo />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F1F5F9",
  },
  email: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: "#64748B",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
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
  menuContainer: {
    gap: 12,
    marginBottom: 30,
  },
  menuItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  adminInfoCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  adminInfoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  adminInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 8,
  },
  adminInfoText: {
    fontSize: 14,
    color: "#15803D",
    textAlign: "center",
    lineHeight: 20,
  },
  quickActionsContainer: {
    alignItems: "center",
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 200,
  },
  quickActionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ProfilAdminScreen