"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

const ParametresScreen = () => {
  const router = useRouter()

  // États pour les toggles
  const [notificationsPush, setNotificationsPush] = useState(true)
  const [notificationsMail, setNotificationsMail] = useState(true)
  const [modeSombre, setModeSombre] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: () => {
          // Logique de déconnexion ici
          Alert.alert("Déconnecté", "Vous avez été déconnecté avec succès")
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Section Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>

            <View style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIconContainer, { backgroundColor: "#E3F2FD" }]}>
                    <Ionicons name="notifications-outline" size={20} color="#2196F3" />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Notifications push</Text>
                    <Text style={styles.settingDescription}>Recevoir des notifications sur votre appareil</Text>
                  </View>
                </View>
                <Switch
                  value={notificationsPush}
                  onValueChange={setNotificationsPush}
                  trackColor={{ false: "#E2E8F0", true: "#BBDEFB" }}
                  thumbColor={notificationsPush ? "#2196F3" : "#94A3B8"}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIconContainer, { backgroundColor: "#E8F5E9" }]}>
                    <Ionicons name="mail-outline" size={20} color="#4CAF50" />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Notifications mail</Text>
                    <Text style={styles.settingDescription}>Recevoir des mises à jour par email</Text>
                  </View>
                </View>
                <Switch
                  value={notificationsMail}
                  onValueChange={setNotificationsMail}
                  trackColor={{ false: "#E2E8F0", true: "#C8E6C9" }}
                  thumbColor={notificationsMail ? "#4CAF50" : "#94A3B8"}
                />
              </View>
            </View>
          </View>

          {/* Section Apparence */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Apparence</Text>

            <View style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIconContainer, { backgroundColor: "#F3E5F5" }]}>
                    <Ionicons name="moon-outline" size={20} color="#9C27B0" />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Mode sombre</Text>
                    <Text style={styles.settingDescription}>Activer le thème sombre de l'application</Text>
                  </View>
                </View>
                <Switch
                  value={modeSombre}
                  onValueChange={setModeSombre}
                  trackColor={{ false: "#E2E8F0", true: "#E1BEE7" }}
                  thumbColor={modeSombre ? "#9C27B0" : "#94A3B8"}
                />
              </View>
            </View>
          </View>

          {/* Section Confidentialité */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Confidentialité</Text>

            <View style={styles.settingsCard}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => setShowPrivacyModal(true)}
                activeOpacity={0.7}
              >
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIconContainer, { backgroundColor: "#FFF3E0" }]}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#FF9800" />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Politique de confidentialité</Text>
                    <Text style={styles.settingDescription}>Consulter notre politique de confidentialité</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bouton Déconnexion */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={styles.logoutIcon} />
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Confidentialité */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Politique de confidentialité</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowPrivacyModal(false)}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalScrollContent}>
              <Text style={styles.privacyTitle}>EPF Projets - Junior Entreprise</Text>

              <Text style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>1. Collecte des données{"\n"}</Text>
                Notre application collecte uniquement les données nécessaires au bon fonctionnement de nos services :
                informations de profil, données académiques, et préférences utilisateur. Aucune donnée sensible n'est
                collectée sans votre consentement explicite.
              </Text>

              <Text style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>2. Utilisation des données{"\n"}</Text>
                Les données collectées sont utilisées exclusivement pour :{"\n"}• Personnaliser votre expérience
                utilisateur
                {"\n"}• Vous proposer des événements et formations pertinents
                {"\n"}• Améliorer nos services et fonctionnalités
                {"\n"}• Communiquer avec vous concernant vos participations
              </Text>

              <Text style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>3. Protection des données{"\n"}</Text>
                En tant que Junior Entreprise, nous nous engageons à protéger vos données personnelles. Toutes les
                informations sont chiffrées et stockées de manière sécurisée. Nous ne partageons jamais vos données avec
                des tiers sans votre autorisation.
              </Text>

              <Text style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>4. Confidentialité des projets{"\n"}</Text>
                Les informations relatives aux projets de la Junior Entreprise sont strictement confidentielles. Aucune
                donnée concernant nos clients, missions ou projets en cours ne peut être diffusée en dehors de
                l'organisation.
              </Text>

              <Text style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>5. Vos droits{"\n"}</Text>
                Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour
                exercer ces droits, contactez-nous à l'adresse : privacy@epf-projets.fr
              </Text>

              <Text style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>6. Contact{"\n"}</Text>
                Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter :{"\n"}•
                Email : contact@epf-projets.fr
                {"\n"}• Téléphone : +33 1 23 45 67 89
                {"\n"}• Adresse : 3 rue des Ingénieurs, 75015 Paris
              </Text>

              <Text style={styles.lastUpdated}>Dernière mise à jour : Janvier 2024</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  settingsCard: {
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
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: "#64748B",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  logoutButton: {
    backgroundColor: "#E53E3E",
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
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  privacyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 20,
    textAlign: "center",
  },
  privacySection: {
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
    marginBottom: 20,
    textAlign: "justify",
  },
  privacySectionTitle: {
    fontWeight: "bold",
    color: "#1E293B",
  },
  lastUpdated: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
})

export default ParametresScreen
