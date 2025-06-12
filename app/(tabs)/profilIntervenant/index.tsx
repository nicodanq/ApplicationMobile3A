"use client"
import HeaderPage from "@/components/HeaderPage"
import { useSession } from "@/contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const Profile = () => {
  const router = useRouter()
  const { user, token } = useSession();

   // Données d'exemple - vous pouvez les remplacer par des données réelles
  const userStats = {
    etudes: 3, // Nombre d'études en cours ou terminées
    evenements: 5, // Nombre d'événements auxquels l'utilisateur participe
    articles: 8, // Nombre d'articles enregistrés
  }
  

  return (
    <View style={styles.container}>
    <HeaderPage title="Profil"/>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" }}
            style={styles.profileImage}
          />
        </View>

        {/* Profile Name */}
        <Text style={styles.profileName}>{user?.email}</Text>
        <Text style={styles.profileRole}>Étudiante en ingénierie</Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.etudes}</Text>
            <Text style={styles.statLabel}>Études</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.evenements}</Text>
            <Text style={styles.statLabel}>Événements</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.articles}</Text>
            <Text style={styles.statLabel}>Articles</Text>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        {/* Mes informations */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(tabs)/profilIntervenant/informations')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: "#E3F2FD" }]}>
            <Ionicons name="person-outline" size={20} color="#2196F3" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Mes informations</Text>
            <Text style={styles.menuSubtext}>Profil, coordonnées, préférences</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* Mes études */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/profilIntervenant/etudes')} activeOpacity={0.7}>
          <View style={[styles.menuIconContainer, { backgroundColor: "#E8F5E9" }]}>
            <Ionicons name="school-outline" size={20} color="#4CAF50" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Mes études</Text>
            <Text style={styles.menuSubtext}>Parcours, formations, certifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* Participation aux événements */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(tabs)/profilIntervenant/participation_evenements')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: "#E0F7FA" }]}>
            <Ionicons name="calendar-outline" size={20} color="#00BCD4" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Mes événements</Text>
            <Text style={styles.menuSubtext}>Événements auxquels vous participez</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* Articles enregistrés */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(tabs)/profilIntervenant/articles_enregistres')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: "#FFF3E0" }]}>
            <Ionicons name="bookmark-outline" size={20} color="#FF9800" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Articles enregistrés</Text>
            <Text style={styles.menuSubtext}>Articles que vous avez sauvegardés</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* Paramètres */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/profilIntervenant/parametres')} activeOpacity={0.7}>
          <View style={[styles.menuIconContainer, { backgroundColor: "#FCE4EC" }]}>
            <Ionicons name="settings-outline" size={20} color="#E91E63" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Paramètres</Text>
            <Text style={styles.menuSubtext}>Confidentialité, notifications, sécurité</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 5,
  },
  headerLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 16,
  },
  profileCard: {

    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 3,
  },
  profileRole: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 1,
  },
  menuSubtext: {
    fontSize: 12,
    color: "#64748B",
  },
})

export default Profile
