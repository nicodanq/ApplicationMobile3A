"use client"

import { useSession } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import Animated, { FadeInDown } from "react-native-reanimated";

import FooterLogo from "@/components/FooterLogo";

// Interface pour les éléments de paramètres
interface SettingItem {
  id: string
  title: string
  subtitle: string
  type: "switch" | "navigation" | "action"
  value?: boolean
  onToggle?: (value: boolean) => void
  icon?: string
  color?: string
}

interface SettingsGroup {
  title: string
  items: SettingItem[]
}

const ParametresAdminScreen = () => {
  const router = useRouter();
  const { user, signOut } = useSession();

  // États pour les switches
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const settingsGroups: SettingsGroup[] = [
    {
      title: "Notifications",
      items: [
        {
          id: "notifications",
          title: "Notifications push",
          subtitle: "Recevoir les notifications sur l'appareil",
          type: "switch",
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: "email",
          title: "Alertes par email",
          subtitle: "Recevoir les alertes importantes par email",
          type: "switch",
          value: emailAlerts,
          onToggle: setEmailAlerts,
        },
      ]
    },
    {
      title: "Sécurité",
      items: [
        {
          id: "security",
          title: "Alertes de sécurité",
          subtitle: "Notifications pour les événements de sécurité",
          type: "switch",
          value: securityAlerts,
          onToggle: setSecurityAlerts,
        },
        {
          id: "password",
          title: "Changer le mot de passe",
          subtitle: "Modifier votre mot de passe administrateur",
          type: "navigation",
          icon: "lock-closed-outline",
        },
        {
          id: "2fa",
          title: "Authentification à deux facteurs",
          subtitle: "Configurer la double authentification",
          type: "navigation",
          icon: "shield-checkmark-outline",
        },
      ]
    },
    {
      title: "Administration",
      items: [
        {
          id: "maintenance",
          title: "Mode maintenance",
          subtitle: "Activer le mode maintenance de la plateforme",
          type: "switch",
          value: maintenanceMode,
          onToggle: setMaintenanceMode,
        },
        {
          id: "logs",
          title: "Journaux système",
          subtitle: "Consulter les logs d'activité",
          type: "navigation",
          icon: "document-text-outline",
        },
      ]
    },
    {
      title: "Compte",
      items: [
        {
          id: "privacy",
          title: "Confidentialité",
          subtitle: "Consulter notre politique de confidentialité",
          type: "navigation",
          icon: "eye-off-outline",
        },
        {
          id: "logout",
          title: "Se déconnecter",
          subtitle: "Fermer la session administrateur",
          type: "action",
          icon: "log-out-outline",
          color: "#EF4444",
        },
      ]
    }
  ]

  const handleItemPress = (item: SettingItem) => {
    if (item.type === "navigation") {
      if (item.id === "privacy") {
        setShowPrivacyModal(true); // Affiche le modal
      } else {
        console.log(`Navigate to ${item.id}`);
      }
    } else if (item.type === "action") {
      if (item.id === "logout") {
        signOut(); // Déconnexion de l'utilisateur
      }
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>

          {settingsGroups.map((group, groupIndex) => (
            <Animated.View
              key={group.title}
              entering={FadeInDown.delay(100 + groupIndex * 100)}
              style={styles.settingsGroup}
            >
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.groupContainer}>
                {group.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.settingItem,
                      itemIndex === group.items.length - 1 && styles.lastItem
                    ]}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={item.type === "switch" ? 1 : 0.7}
                    disabled={item.type === "switch"}
                  >
                    <View style={styles.settingContent}>
                      {item.icon && (
                        <View style={[
                          styles.settingIcon,
                          { backgroundColor: item.color ? `${item.color}15` : "#F1F5F9" }
                        ]}>
                          <Ionicons
                            name={item.icon as any}
                            size={20}
                            color={item.color || "#64748B"}
                          />
                        </View>
                      )}
                      <View style={styles.settingText}>
                        <Text style={[
                          styles.settingTitle,
                          { color: item.color || "#1E293B" }
                        ]}>
                          {item.title}
                        </Text>
                        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                      </View>
                      {item.type === "switch" ? (
                        <Switch
                          value={item.value || false}
                          onValueChange={item.onToggle || (() => { })}
                          trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
                          thumbColor={item.value ? "#FFFFFF" : "#FFFFFF"}
                        />
                      ) : (
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          ))}

          {/* Version Info */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.versionInfo}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
            <Text style={styles.versionSubtext}>Plateforme d&#39;administration</Text>
          </Animated.View>

        </View>
      </ScrollView>

      <FooterLogo />
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
                Notre application collecte uniquement les données nécessaires au bon fonctionnement de nos services : informations de profil, données académiques, et préférences utilisateur. Aucune donnée sensible n&apos;est collectée sans votre consentement explicite.
              </Text>

              <Text style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>2. Utilisation des données{"\n"}</Text>
                Les données collectées sont utilisées exclusivement pour :{"\n"}• Personnaliser votre expérience utilisateur{"\n"}• Vous proposer des événements et formations pertinents{"\n"}• Améliorer nos services et fonctionnalités{"\n"}• Communiquer avec vous concernant vos participations
              </Text>

              <Text style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>3. Protection des données{"\n"}</Text>
                En tant que Junior Entreprise, nous nous engageons à protéger vos données personnelles. Toutes les informations sont chiffrées et stockées de manière sécurisée. Nous ne partageons jamais vos données avec des tiers sans votre autorisation.
              </Text>

              <Text style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>4. Confidentialité des projets{"\n"}</Text>
                Les informations relatives aux projets de la Junior Entreprise sont strictement confidentielles. Aucune donnée concernant nos clients, missions ou projets en cours ne peut être diffusée en dehors de l&apos;organisation.
              </Text>

              <Text style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>5. Vos droits{"\n"}</Text>
                Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez-nous à l&apos;adresse : privacy@epf-projets.fr
              </Text>

              <Text style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>6. Contact{"\n"}</Text>
                Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter :{"\n"}• Email : contact@epf-projets.fr{"\n"}• Téléphone : +33 1 23 45 67 89{"\n"}• Adresse : 3 rue des Ingénieurs, 75015 Paris
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 20,
  },
  settingsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    marginLeft: 4,
  },
  groupContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  versionInfo: {
    alignItems: "center",
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: "#94A3B8",
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

export default ParametresAdminScreen