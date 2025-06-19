"use client"

import api from "@/api/axiosClient"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

import FooterLogo from "@/components/FooterLogo"
import { Float } from "react-native/Libraries/Types/CodegenTypes"

interface Intervenant {
  id: number
  prenom: string
  nom: string
  email: string
  statut: "en_attente" | "affecte" | "refuse"
  prix: Float
  dateNaissance: string
  biographie: string
}

const GererIntervenantsScreen = () => {
  const router = useRouter()
  const { etudeData } = useLocalSearchParams()

  const etude = etudeData ? JSON.parse(etudeData as string) : null
  const [selectedPostulant, setSelectedPostulant] = useState<Intervenant | null>(null)
  const [intervenants, setIntervenants] = useState<Intervenant[]>([])
  const [isValidated, setIsValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const fetchIntervenants = useCallback(async () => {
    if (!etude?.id) return
    console.log("🔄 fetchIntervenants lancé avec ID =", etude.id)
    try {
      setRefreshing(true)
      const { data } = await api.get(`/etude/${etude.id}/intervenants`)
      setIntervenants(data)

      // Vérifier si l'étude est déjà validée
      const etudeResponse = await api.get(`/etude/${etude.id}`)
      setIsValidated(etudeResponse.data.ID_statutE !== 3 ? true : false);
      console.log("🔍 Étude validée :", etudeResponse.data.ID_statutE !== 3 ? "Oui" : "Non");
      console.log("🧪 Statut brut reçu :", etudeResponse.data.ID_statutE);

    } catch (err) {
      console.error("Erreur chargement intervenants :", err)
      Alert.alert("Erreur", "Impossible de charger les intervenants")
    } finally {
      setRefreshing(false)
    }
  }, [etude?.id])

  useEffect(() => {
    fetchIntervenants()
  }, [fetchIntervenants])

  const updateIntervenant = async (postulant: Intervenant) => {
    try {
      setLoading(true)
      console.log("🔄 Mise à jour intervenant:", postulant.id, "statut:", postulant.statut, "prix:", postulant.prix)

      const response = await api.patch(`/user/intervenant/${postulant.id}`, {
        etudeId: etude.id,
        statut: postulant.statut,
        prix: String(postulant.prix) !== "" ? Number(postulant.prix) : null,
      })

      console.log("✅ Réponse API:", response.data)

      // Mettre à jour l'état local après succès de l'API
      setIntervenants((prev) => prev.map((p) => (p.id === postulant.id ? postulant : p)))

      return true
    } catch (err) {
      console.error("❌ Erreur mise à jour intervenant :", err)
      Alert.alert("Erreur", "Impossible de mettre à jour l'intervenant")

      // Recharger les données en cas d'erreur
      await fetchIntervenants()
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleAffecterIntervenant = async () => {
    if (!selectedPostulant || isValidated) return

    console.log("🎯 Affectation intervenant:", selectedPostulant.id)
    const updated = { ...selectedPostulant, statut: "affecte" as const }

    const success = await updateIntervenant(updated)
    if (success) {
      Alert.alert("Succès", `${updated.prenom} ${updated.nom} a été affecté(e)`)
      setSelectedPostulant(null)
    }
  }

  const handleRefuserCandidature = async () => {
    if (!selectedPostulant || isValidated) return

    Alert.alert(
      "Refuser la candidature",
      `Êtes-vous sûr de vouloir refuser la candidature de ${selectedPostulant.prenom} ${selectedPostulant.nom} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Refuser",
          style: "destructive",
          onPress: async () => {
            console.log("❌ Refus candidature:", selectedPostulant.id)
            const updated = { ...selectedPostulant, statut: "refuse" as const }

            const success = await updateIntervenant(updated)
            if (success) {
              Alert.alert(
                "Candidature refusée",
                `La candidature de ${selectedPostulant.prenom} ${selectedPostulant.nom} a été refusée`,
              )
              setSelectedPostulant(null)
            }
          },
        },
      ],
    )
  }

  const handleRetirerIntervenant = async (postulant: Intervenant) => {
    if (isValidated) return

    console.log("🔄 Tentative de retrait intervenant:", postulant.id)

    Alert.alert(
      "Retirer l'intervenant",
      `Êtes-vous sûr de vouloir retirer ${postulant.prenom} ${postulant.nom} de cette étude ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Retirer",
          style: "destructive",
          onPress: async () => {
            console.log("⬅️ Retrait intervenant:", postulant.id)
            const updated = { ...postulant, statut: "en_attente" as const }

            const success = await updateIntervenant(updated)
            if (success) {
              Alert.alert("Succès", `${postulant.prenom} ${postulant.nom} a été retiré(e) de l'étude`)
            }
          },
        },
      ],
    )
  }

  const handleReactiverCandidature = async (postulant: Intervenant) => {
    if (isValidated) return

    Alert.alert(
      "Réactiver la candidature",
      `Êtes-vous sûr de vouloir réactiver la candidature de ${postulant.prenom} ${postulant.nom} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réactiver",
          onPress: async () => {
            console.log("🔄 Réactivation candidature:", postulant.id)
            const updated = { ...postulant, statut: "en_attente" as const }

            const success = await updateIntervenant(updated)
            if (success) {
              Alert.alert("Succès", `La candidature de ${postulant.prenom} ${postulant.nom} a été réactivée`)
            }
          },
        },
      ],
    )
  }

  const handleSelectPostulant = (postulant: Intervenant) => {
    if (!isValidated) {
      console.log("👤 Sélection postulant:", postulant.id)
      setSelectedPostulant(postulant)
    }
  }

  const handleUpdatePrix = (postulantId: number, prix: string) => {
    if (isValidated) return

    console.log("💰 Mise à jour prix:", postulantId, prix)

    // Mise à jour optimiste de l'état local
    setIntervenants((prev) =>
      prev.map((p) =>
        p.id === postulantId
          ? { ...p, prix: prix === "" ? 0 : Number(prix) }
          : p
      )
    )

    // Mettre à jour aussi le postulant sélectionné si c'est le même
    if (selectedPostulant && selectedPostulant.id === postulantId) {
      setSelectedPostulant((prev) => (prev ? { ...prev, prix: prix === "" ? 0 : Number(prix) } : null))
    }
  }

  const handleValidateChoices = async () => {
    console.log("✅ Tentative de validation des choix")

    const intervenantsAffectes = intervenants.filter((p) => p.statut === "affecte")

    if (intervenantsAffectes.length === 0) {
      Alert.alert("Attention", "Vous devez affecter au moins un intervenant avant de valider.")
      return
    }

    const intervenantsSansPrix = intervenantsAffectes.filter((p) => p.prix === null || p.prix === undefined || p.prix === 0)
    if (intervenantsSansPrix.length > 0) {
      Alert.alert("Attention", "Tous les intervenants affectés doivent avoir un prix défini.")
      return
    }

    Alert.alert(
      "Valider les choix",
      `Vous allez valider la sélection de ${intervenantsAffectes.length} intervenant(s). Cette action ne pourra plus être modifiée.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Valider",
          onPress: async () => {
            try {
              setLoading(true)
              console.log("🔒 Validation en cours...")

              // Sauvegarder tous les prix avant validation
              const updatePromises = intervenantsAffectes.map((intervenant) => updateIntervenant(intervenant))
              await Promise.all(updatePromises)

              // Appel API pour valider l'étude
              await api.post(`/etude/cancel/${etude.id}`, {
                selectedUsers: intervenantsAffectes.map((i) => ({
                  userId: i.id,
                  coeff: i.prix, // ou i.coeff si tu renommes
                }))

              })
              await fetchIntervenants(); // recharge les intervenants + met à jour isValidated
              Alert.alert("Succès", "Les choix d'intervenants ont été validés et verrouillés.");
              console.log("✅ Validation réussie");


              Alert.alert("Succès", "Les choix d'intervenants ont été validés et verrouillés.")
              console.log("✅ Validation réussie")
            } catch (err) {
              console.error("❌ Erreur validation :", err)
              Alert.alert("Erreur", "Impossible de valider les choix.")
            } finally {
              setLoading(false)
            }
          },
        },
      ],
    )
  }

  const handleCancelValidation = async () => {
    console.log("🔁 handleCancelValidation lancé")
    console.log(etude.id ? `pour l'étude ID: ${etude.id}` : "sans ID d'étude")
    Alert.alert(
      "Annuler la validation",
      "Êtes-vous sûr de vouloir annuler la validation ? Vous pourrez à nouveau modifier les intervenants.",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui",
          onPress: async () => {
            try {
              setLoading(true)
              console.log("🔓 Annulation validation...")

              // Appel API pour annuler la validation
              await api.post(`/etude/cancel/${etude.id}`, {

              });

              console.log("✅ Annulation API réussie");
              setIsValidated(false)
              Alert.alert("Validation annulée", "Vous pouvez à nouveau modifier les intervenants.")
              await fetchIntervenants()
            } catch (err) {
              console.error("❌ Erreur annulation validation :", err)
              Alert.alert("Erreur", "Impossible d'annuler la validation.")
            } finally {
              setLoading(false)
            }
          },
        },
      ],
    )
  }

  if (!etude) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Erreur: Données de l&apos;étude non trouvées</Text>
      </SafeAreaView>
    )
  }

  const intervenantsAffectes = intervenants.filter((p) => p.statut === "affecte")
  const postulantsEnAttente = intervenants.filter((p) => p.statut === "en_attente")
  const candidaturesRefusees = intervenants.filter((p) => p.statut === "refuse")

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestion des intervenants</Text>
        <TouchableOpacity onPress={fetchIntervenants} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Indicateur de validation */}
      {isValidated && (
        <View style={styles.validationBanner}>
          <Ionicons name="lock-closed" size={16} color="#10B981" />
          <Text style={styles.validationText}>Choix validés et verrouillés</Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchIntervenants} colors={["#10B981"]} />}
      >
        <View style={styles.scrollContent}>
          {/* Intervenants affectés */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <Text style={styles.sectionTitle}>Intervenants affectés ({intervenantsAffectes.length})</Text>
            {intervenantsAffectes.map((postulant) => (
              <TouchableOpacity
                key={postulant.id}
                style={[styles.postulantCard, styles.postulantAffecte, isValidated && styles.cardLocked]}
                onPress={() => handleSelectPostulant(postulant)}
                activeOpacity={isValidated ? 1 : 0.7}
              >
                <View style={styles.postulantInfo}>

                  <View style={styles.postulantDetails}>
                    <Text style={styles.postulantName}>
                      {postulant.prenom} {postulant.nom}
                    </Text>
                    <Text style={styles.postulantEmail}>{postulant.email}</Text>
                    <View style={styles.prixContainer}>
                      <Text style={styles.prixLabel}>Prix: </Text>
                      <TextInput
                        style={[styles.prixInput, isValidated && styles.prixInputLocked]}
                        value={postulant.prix !== undefined && postulant.prix !== null ? String(postulant.prix) : ""}
                        onChangeText={(text) => handleUpdatePrix(postulant.id, text)}
                        placeholder="0 €"
                        keyboardType="numeric"
                        editable={!isValidated}
                      />
                      <Text style={styles.prixCurrency}>€</Text>
                    </View>
                  </View>
                </View>
                {!isValidated && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={(e) => {
                      e.stopPropagation()
                      handleRetirerIntervenant(postulant)
                    }}
                  >
                    <Ionicons name="remove-circle" size={24} color="#EF4444" />
                  </TouchableOpacity>
                )}
                {isValidated && <Ionicons name="lock-closed" size={20} color="#10B981" />}
              </TouchableOpacity>
            ))}
            {intervenantsAffectes.length === 0 && <Text style={styles.emptyText}>Aucun intervenant affecté</Text>}
          </Animated.View>

          {/* Postulants en attente */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={styles.sectionTitle}>Candidatures en attente ({postulantsEnAttente.length})</Text>
            {postulantsEnAttente.map((postulant) => (
              <TouchableOpacity
                key={postulant.id}
                style={[styles.postulantCard, isValidated && styles.cardLocked]}
                onPress={() => handleSelectPostulant(postulant)}
                activeOpacity={isValidated ? 1 : 0.7}
              >
                <View style={styles.postulantInfo}>

                  <View style={styles.postulantDetails}>
                    <Text style={styles.postulantName}>
                      {postulant.prenom} {postulant.nom}
                    </Text>
                    <Text style={styles.postulantEmail}>{postulant.email}</Text>
                  </View>
                </View>
                {!isValidated && <Ionicons name="chevron-forward" size={20} color="#94A3B8" />}
                {isValidated && <Ionicons name="lock-closed" size={20} color="#94A3B8" />}
              </TouchableOpacity>
            ))}
            {postulantsEnAttente.length === 0 && <Text style={styles.emptyText}>Aucune candidature en attente</Text>}
          </Animated.View>

          {/* Candidatures refusées */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <Text style={styles.sectionTitle}>Candidatures refusées ({candidaturesRefusees.length})</Text>
            {candidaturesRefusees.map((postulant) => (
              <TouchableOpacity
                key={postulant.id}
                style={[styles.postulantCard, styles.postulantRefuse, isValidated && styles.cardLocked]}
                onPress={() => handleSelectPostulant(postulant)}
                activeOpacity={isValidated ? 1 : 0.7}
              >
                <View style={styles.postulantInfo}>

                  <View style={styles.postulantDetails}>
                    <Text style={[styles.postulantName, styles.postulantNameRefuse]}>
                      {postulant.prenom} {postulant.nom}
                    </Text>
                    <Text style={styles.postulantEmail}>{postulant.email}</Text>
                  </View>
                </View>
                {!isValidated && (
                  <TouchableOpacity
                    style={styles.reactivateButton}
                    onPress={(e) => {
                      e.stopPropagation()
                      handleReactiverCandidature(postulant)
                    }}
                  >
                    <Ionicons name="refresh-circle" size={24} color="#F59E0B" />
                  </TouchableOpacity>
                )}
                {isValidated && <Ionicons name="lock-closed" size={20} color="#94A3B8" />}
              </TouchableOpacity>
            ))}
            {candidaturesRefusees.length === 0 && <Text style={styles.emptyText}>Aucune candidature refusée</Text>}
          </Animated.View>

          {/* Boutons d'action */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.validationSection}>
            {!isValidated ? (
              <TouchableOpacity
                style={[styles.validateButton, loading && styles.buttonDisabled]}
                onPress={handleValidateChoices}
                activeOpacity={0.7}
                disabled={loading}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.validateButtonText}>Valider les choix d&apos;intervenants</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.validatedActions}>
                <TouchableOpacity
                  style={[styles.cancelValidationButton, loading && styles.buttonDisabled]}
                  onPress={() => {
                    console.log("🚨 Bouton Annuler pressé");
                    handleCancelValidation();
                  }}
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  <Ionicons name="close-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.cancelValidationButtonText}>Annuler la validation</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </ScrollView >

      {/* Modal pour le profil détaillé */}
      < Modal
        visible={selectedPostulant !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedPostulant(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header du modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSelectedPostulant(null)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedPostulant ? `${selectedPostulant.prenom} ${selectedPostulant.nom}` : ""}
            </Text>
            <View style={{ width: 32 }} />
          </View>

          <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
            {selectedPostulant && (
              <Animated.View entering={FadeInDown.delay(100)} style={styles.profileContainer}>
                <View style={styles.profileHeader}>

                  <Text style={styles.profileName}>
                    {selectedPostulant.prenom} {selectedPostulant.nom}
                  </Text>
                  <View
                    style={[
                      styles.statutBadge,
                      selectedPostulant.statut === "affecte" && styles.statutAffecte,
                      selectedPostulant.statut === "refuse" && styles.statutRefuse,
                      selectedPostulant.statut === "en_attente" && styles.statutEnAttente,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statutText,
                        selectedPostulant.statut === "affecte" && styles.statutTextAffecte,
                        selectedPostulant.statut === "refuse" && styles.statutTextRefuse,
                        selectedPostulant.statut === "en_attente" && styles.statutTextEnAttente,
                      ]}
                    >
                      {selectedPostulant.statut === "affecte" && "Affecté"}
                      {selectedPostulant.statut === "refuse" && "Refusé"}
                      {selectedPostulant.statut === "en_attente" && "En attente"}
                    </Text>
                  </View>
                </View>

                <View style={styles.profileDetails}>
                  <View style={styles.profileField}>
                    <Text style={styles.profileLabel}>Prénom</Text>
                    <Text style={styles.profileValue}>{selectedPostulant.prenom}</Text>
                  </View>
                  <View style={styles.profileField}>
                    <Text style={styles.profileLabel}>Nom</Text>
                    <Text style={styles.profileValue}>{selectedPostulant.nom}</Text>
                  </View>
                  <View style={styles.profileField}>
                    <Text style={styles.profileLabel}>Email</Text>
                    <Text style={styles.profileValue}>{selectedPostulant.email}</Text>
                  </View>
                  <View style={styles.profileField}>
                    <Text style={styles.profileLabel}>Date de naissance</Text>
                    <Text style={styles.profileValue}>{selectedPostulant.dateNaissance}</Text>
                  </View>
                  <View style={styles.profileField}>
                    <Text style={styles.profileLabel}>Biographie</Text>
                    <Text style={styles.profileValue}>{selectedPostulant.biographie}</Text>
                  </View>
                  <TouchableOpacity style={styles.profileField}>
                    <Text style={styles.profileLabel}>GitHub</Text>
                    <Text style={styles.profileLink}>Voir le profil GitHub</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.competencesSection}>
                  <Text style={styles.competencesTitle}>Compétences</Text>

                </View>

                {/* Prix pour les intervenants affectés */}
                {selectedPostulant.statut === "affecte" && (
                  <View style={styles.prixSection}>
                    <Text style={styles.prixSectionTitle}>Prix attribué</Text>
                    <View style={styles.prixInputContainer}>
                      <TextInput
                        style={[styles.prixInputLarge, isValidated && styles.prixInputLocked]}
                        value={selectedPostulant.prix !== undefined && selectedPostulant.prix !== null ? String(selectedPostulant.prix) : ""}
                        onChangeText={(text) => handleUpdatePrix(selectedPostulant.id, text)}
                        placeholder="Montant en euros"
                        keyboardType="numeric"
                        editable={!isValidated}
                      />
                      <Text style={styles.prixCurrencyLarge}>€</Text>
                    </View>
                  </View>
                )}

                {/* Boutons d'action selon le statut */}
                {!isValidated && (
                  <View style={styles.actionButtons}>
                    {selectedPostulant.statut === "en_attente" && (
                      <>
                        <TouchableOpacity
                          style={[styles.affectButton, loading && styles.buttonDisabled]}
                          onPress={handleAffecterIntervenant}
                          activeOpacity={0.7}
                          disabled={loading}
                        >
                          <Text style={styles.affectButtonText}>Affecter à l&apos;étude</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.refuseButton, loading && styles.buttonDisabled]}
                          onPress={handleRefuserCandidature}
                          activeOpacity={0.7}
                          disabled={loading}
                        >
                          <Text style={styles.refuseButtonText}>Refuser la candidature</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {selectedPostulant.statut === "affecte" && (
                      <TouchableOpacity
                        style={[styles.removeFromStudyButton, loading && styles.buttonDisabled]}
                        onPress={() => handleRetirerIntervenant(selectedPostulant)}
                        activeOpacity={0.7}
                        disabled={loading}
                      >
                        <Text style={styles.removeFromStudyButtonText}>Retirer de l&apos;étude</Text>
                      </TouchableOpacity>
                    )}

                    {selectedPostulant.statut === "refuse" && (
                      <TouchableOpacity
                        style={[styles.reactivateFullButton, loading && styles.buttonDisabled]}
                        onPress={() => handleReactiverCandidature(selectedPostulant)}
                        activeOpacity={0.7}
                        disabled={loading}
                      >
                        <Text style={styles.reactivateFullButtonText}>Réactiver la candidature</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {isValidated && (
                  <View style={styles.lockedMessage}>
                    <Ionicons name="lock-closed" size={20} color="#10B981" />
                    <Text style={styles.lockedMessageText}>Les choix sont validés et verrouillés</Text>
                  </View>
                )}
              </Animated.View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal >
      <FooterLogo />
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 8,
  },
  refreshButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  validationBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D1FAE5",
    paddingVertical: 8,
  },
  validationText: {
    color: "#10B981",
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#334155",
  },
  postulantCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardLocked: {
    backgroundColor: "#F0F0F0",
  },
  postulantInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postulantDetails: {
    flexDirection: "column",
    flex: 1,
  },
  postulantName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E293B",
  },
  postulantNameRefuse: {
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },
  postulantEmail: {
    fontSize: 14,
    color: "#475569",
  },
  prixContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  prixLabel: {
    fontSize: 14,
    color: "#475569",
    marginRight: 4,
  },
  prixInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 80,
    fontSize: 14,
    color: "#1E293B",
  },
  prixInputLocked: {
    backgroundColor: "#E5E7EB",
  },
  prixCurrency: {
    fontSize: 14,
    color: "#475569",
    marginLeft: 4,
  },
  removeButton: {
    padding: 8,
  },
  reactivateButton: {
    padding: 8,
  },
  validationSection: {
    marginTop: 24,
    marginBottom: 32,
    alignItems: "center",
  },
  validatedActions: {
    width: "100%",
    gap: 12,
  },
  validateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
  },
  validateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  cancelValidationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelValidationButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  startEtudeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startEtudeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
    color: "#475569",
    fontStyle: "italic",
  },
  postulantAffecte: {
    backgroundColor: "#D1FAE5",
  },
  postulantRefuse: {
    backgroundColor: "#FEE2E2",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  modalScrollView: {
    flex: 1,
  },
  profileContainer: {
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  statutBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  statutText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statutAffecte: {
    backgroundColor: "#BBF7D0",
  },
  statutTextAffecte: {
    color: "#065F46",
  },
  statutRefuse: {
    backgroundColor: "#FEE2E2",
  },
  statutTextRefuse: {
    color: "#B91C1C",
  },
  statutEnAttente: {
    backgroundColor: "#E5E7EB",
  },
  statutTextEnAttente: {
    color: "#4B5563",
  },
  profileDetails: {
    marginBottom: 24,
  },
  profileField: {
    marginBottom: 12,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 16,
    color: "#475569",
  },
  profileLink: {
    fontSize: 16,
    color: "#2563EB",
  },
  competencesSection: {
    marginBottom: 24,
  },
  competencesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 12,
  },
  competencesList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  competenceTagLarge: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  competenceTextLarge: {
    fontSize: 14,
    color: "#4B5563",
  },
  prixSection: {
    marginBottom: 24,
  },
  prixSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 12,
  },
  prixInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  prixInputLarge: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 120,
    fontSize: 16,
    color: "#1E293B",
  },
  prixCurrencyLarge: {
    fontSize: 16,
    color: "#475569",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "column",
    marginBottom: 24,
  },
  affectButton: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  affectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  refuseButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    borderRadius: 8,
  },
  refuseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  removeFromStudyButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 12,
    borderRadius: 8,
  },
  removeFromStudyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  reactivateFullButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 8,
  },
  reactivateFullButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  lockedMessage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D1FAE5",
    paddingVertical: 12,
    borderRadius: 8,
  },
  lockedMessageText: {
    color: "#10B981",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
})

export default GererIntervenantsScreen
