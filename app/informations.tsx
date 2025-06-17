
"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const InformationsScreen = () => {
  const router = useRouter()

  // Données utilisateur (à remplacer par les vraies données)
  const userInfo = {
    prenom: "Lina",
    nom: "BENABDELOUAHED",
    email: "lina.benabdelouahed@epf.fr",
    telephone: "+33 6 12 34 56 78",
    dateNaissance: "15/04/1998",
    adresse: "3 rue des Ingénieurs, 75015 Paris",
    biographie:
      "Étudiante passionnée par l'ingénierie des systèmes et l'innovation technologique. Toujours à la recherche de nouveaux défis et d'opportunités d'apprentissage.",
    lienGithub: "https://github.com/lina-benabdelouahed",
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes informations</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Informations personnelles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Prénom</Text>
                <Text style={styles.infoValue}>{userInfo.prenom}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Nom</Text>
                <Text style={styles.infoValue}>{userInfo.nom}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date de naissance</Text>
                <Text style={styles.infoValue}>{userInfo.dateNaissance}</Text>
              </View>
            </View>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Adresse email</Text>
                <Text style={styles.infoValue}>{userInfo.email}</Text>
                <View style={styles.emailBadge}>
                  <Text style={styles.emailBadgeText}>Non modifiable</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Téléphone</Text>
                <Text style={styles.infoValue}>{userInfo.telephone}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Adresse</Text>
                <Text style={styles.infoValue}>{userInfo.adresse}</Text>
              </View>
            </View>
          </View>

          {/* Autres informations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Autres informations</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Biographie</Text>
                <Text style={styles.infoValueMultiline}>{userInfo.biographie}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Lien Github</Text>
                <Text style={[styles.infoValue, styles.linkText]}>{userInfo.lienGithub}</Text>
              </View>
            </View>
          </View>

          {/* Bouton Modifier */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/(tabs)/profilIntervenant/modifier_informations')}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={20} color="#FFFFFF" style={styles.editIcon} />
            <Text style={styles.editButtonText}>Modifier mes informations</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    marginRight: 15,
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
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  infoItem: {
    padding: 16,
    position: "relative",
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 6,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "400",
  },
  infoValueMultiline: {
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "400",
    lineHeight: 22,
  },
  linkText: {
    color: "#2196F3",
  },
  emailBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  emailBadgeText: {
    fontSize: 12,
    color: "#92400E",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  editButton: {
    backgroundColor: "#2196F3",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  editIcon: {
    marginRight: 8,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default InformationsScreen
