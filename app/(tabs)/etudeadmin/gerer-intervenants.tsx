"use client"

import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

import FooterLogo from "@/components/FooterLogo"

// Données fictives des postulants avec statut
const postulants = [
  {
    id: 1,
    prenom: "Amandine",
    nom: "BOULET",
    email: "amandine.boulet@epfedu.fr",
    dateNaissance: "23 février 2004",
    biographie: "Étudiante en informatique passionnée par le développement web",
    github: "https://github.com/amandine-boulet",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    competences: ["React", "Node.js", "Python"],
    statut: "en_attente" // en_attente, affecte, refuse
  },
  {
    id: 2,
    prenom: "Federico",
    nom: "POSSAMAI",
    email: "federico.possamai@epfedu.fr",
    dateNaissance: "15 mars 2003",
    biographie: "Développeur full-stack avec expertise en systèmes distribués",
    github: "https://github.com/federico-possamai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    competences: ["Java", "Spring", "Docker"],
    statut: "affecte"
  },
  {
    id: 3,
    prenom: "Lina",
    nom: "BENABDELOUAHED",
    email: "lina.benabdelouahed@epfedu.fr",
    dateNaissance: "8 juillet 2004",
    biographie: "Spécialiste en intelligence artificielle et machine learning",
    github: "https://github.com/lina-benabdelouahed",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    competences: ["Python", "TensorFlow", "Data Science"],
    statut: "en_attente"
  },
  {
    id: 4,
    prenom: "Nicolas",
    nom: "DANQUIGNY",
    email: "nicolas.danquigny@epfedu.fr",
    dateNaissance: "12 novembre 2003",
    biographie: "Expert en cybersécurité et développement sécurisé",
    github: "https://github.com/nicolas-danquigny",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    competences: ["Security", "Penetration Testing", "C++"],
    statut: "refuse"
  }
]

const GererIntervenantsScreen = () => {
  const router = useRouter()
  const { etudeData } = useLocalSearchParams()
  
  const etude = etudeData ? JSON.parse(etudeData as string) : null
  const [selectedPostulant, setSelectedPostulant] = useState<any>(null)
  const [intervenants, setIntervenants] = useState(postulants)

  const handleSelectPostulant = (postulant: any) => {
    setSelectedPostulant(postulant)
  }

  const handleAffecterIntervenant = () => {
    if (selectedPostulant) {
      setIntervenants(prev => 
        prev.map(p => 
          p.id === selectedPostulant.id 
            ? { ...p, statut: "affecte" }
            : p
        )
      )
      Alert.alert("Succès", `${selectedPostulant.prenom} ${selectedPostulant.nom} a été affecté(e) à l'étude`)
      setSelectedPostulant(null)
    }
  }

  const handleRefuserCandidature = () => {
    if (selectedPostulant) {
      Alert.alert(
        "Refuser la candidature",
        `Êtes-vous sûr de vouloir refuser la candidature de ${selectedPostulant.prenom} ${selectedPostulant.nom} ?`,
        [
          { text: "Annuler", style: "cancel" },
          { 
            text: "Refuser", 
            style: "destructive",
            onPress: () => {
              setIntervenants(prev => 
                prev.map(p => 
                  p.id === selectedPostulant.id 
                    ? { ...p, statut: "refuse" }
                    : p
                )
              )
              Alert.alert("Candidature refusée", `La candidature de ${selectedPostulant.prenom} ${selectedPostulant.nom} a été refusée`)
              setSelectedPostulant(null)
            }
          }
        ]
      )
    }
  }

  const handleRetirerIntervenant = (postulant: any) => {
    Alert.alert(
      "Retirer l'intervenant",
      `Êtes-vous sûr de vouloir retirer ${postulant.prenom} ${postulant.nom} de cette étude ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Retirer", 
          style: "destructive",
          onPress: () => {
            setIntervenants(prev => 
              prev.map(p => 
                p.id === postulant.id 
                  ? { ...p, statut: "en_attente" }
                  : p
              )
            )
          }
        }
      ]
    )
  }

  const handleReactiverCandidature = (postulant: any) => {
    Alert.alert(
      "Réactiver la candidature",
      `Êtes-vous sûr de vouloir réactiver la candidature de ${postulant.prenom} ${postulant.nom} ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Réactiver", 
          onPress: () => {
            setIntervenants(prev => 
              prev.map(p => 
                p.id === postulant.id 
                  ? { ...p, statut: "en_attente" }
                  : p
              )
            )
          }
        }
      ]
    )
  }

  if (!etude) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Erreur: Données de l'étude non trouvées</Text>
      </SafeAreaView>
    )
  }

  const intervenantsAffectes = intervenants.filter(p => p.statut === "affecte")
  const postulantsEnAttente = intervenants.filter(p => p.statut === "en_attente")
  const candidaturesRefusees = intervenants.filter(p => p.statut === "refuse")

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
        <Text style={styles.headerTitle}>
          {selectedPostulant ? `Profil ${selectedPostulant.prenom} ${selectedPostulant.nom}` : "Gestion des intervenants"}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          
          {!selectedPostulant ? (
            // Liste des postulants
            <>
              {/* Intervenants affectés */}
              <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
                <Text style={styles.sectionTitle}>Intervenants affectés ({intervenantsAffectes.length})</Text>
                {intervenantsAffectes.map((postulant, index) => (
                  <TouchableOpacity
                    key={postulant.id}
                    style={[styles.postulantCard, styles.postulantAffecte]}
                    onPress={() => handleSelectPostulant(postulant)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.postulantInfo}>
                      <Image source={{ uri: postulant.avatar }} style={styles.avatar} />
                      <View style={styles.postulantDetails}>
                        <Text style={styles.postulantName}>{postulant.prenom} {postulant.nom}</Text>
                        <Text style={styles.postulantEmail}>{postulant.email}</Text>
                        <View style={styles.competencesContainer}>
                          {postulant.competences.slice(0, 2).map((comp, idx) => (
                            <View key={idx} style={styles.competenceTag}>
                              <Text style={styles.competenceText}>{comp}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRetirerIntervenant(postulant)}
                    >
                      <Ionicons name="remove-circle" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
                {intervenantsAffectes.length === 0 && (
                  <Text style={styles.emptyText}>Aucun intervenant affecté</Text>
                )}
              </Animated.View>

              {/* Postulants en attente */}
              <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
                <Text style={styles.sectionTitle}>Candidatures en attente ({postulantsEnAttente.length})</Text>
                {postulantsEnAttente.map((postulant, index) => (
                  <TouchableOpacity
                    key={postulant.id}
                    style={styles.postulantCard}
                    onPress={() => handleSelectPostulant(postulant)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.postulantInfo}>
                      <Image source={{ uri: postulant.avatar }} style={styles.avatar} />
                      <View style={styles.postulantDetails}>
                        <Text style={styles.postulantName}>{postulant.prenom} {postulant.nom}</Text>
                        <Text style={styles.postulantEmail}>{postulant.email}</Text>
                        <View style={styles.competencesContainer}>
                          {postulant.competences.slice(0, 2).map((comp, idx) => (
                            <View key={idx} style={styles.competenceTag}>
                              <Text style={styles.competenceText}>{comp}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                ))}
                {postulantsEnAttente.length === 0 && (
                  <Text style={styles.emptyText}>Aucune candidature en attente</Text>
                )}
              </Animated.View>

              {/* Candidatures refusées */}
              <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
                <Text style={styles.sectionTitle}>Candidatures refusées ({candidaturesRefusees.length})</Text>
                {candidaturesRefusees.map((postulant, index) => (
                  <TouchableOpacity
                    key={postulant.id}
                    style={[styles.postulantCard, styles.postulantRefuse]}
                    onPress={() => handleSelectPostulant(postulant)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.postulantInfo}>
                      <Image source={{ uri: postulant.avatar }} style={styles.avatar} />
                      <View style={styles.postulantDetails}>
                        <Text style={[styles.postulantName, styles.postulantNameRefuse]}>{postulant.prenom} {postulant.nom}</Text>
                        <Text style={styles.postulantEmail}>{postulant.email}</Text>
                        <View style={styles.competencesContainer}>
                          {postulant.competences.slice(0, 2).map((comp, idx) => (
                            <View key={idx} style={styles.competenceTag}>
                              <Text style={styles.competenceText}>{comp}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.reactivateButton}
                      onPress={() => handleReactiverCandidature(postulant)}
                    >
                      <Ionicons name="refresh-circle" size={24} color="#F59E0B" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
                {candidaturesRefusees.length === 0 && (
                  <Text style={styles.emptyText}>Aucune candidature refusée</Text>
                )}
              </Animated.View>
            </>
          ) : (
            // Profil détaillé du postulant
            <Animated.View entering={FadeInDown.delay(100)} style={styles.profileContainer}>
              <View style={styles.profileHeader}>
                <Image source={{ uri: selectedPostulant.avatar }} style={styles.profileAvatar} />
                <Text style={styles.profileName}>{selectedPostulant.prenom} {selectedPostulant.nom}</Text>
                <View style={[
                  styles.statutBadge,
                  selectedPostulant.statut === "affecte" && styles.statutAffecte,
                  selectedPostulant.statut === "refuse" && styles.statutRefuse,
                  selectedPostulant.statut === "en_attente" && styles.statutEnAttente
                ]}>
                  <Text style={[
                    styles.statutText,
                    selectedPostulant.statut === "affecte" && styles.statutTextAffecte,
                    selectedPostulant.statut === "refuse" && styles.statutTextRefuse,
                    selectedPostulant.statut === "en_attente" && styles.statutTextEnAttente
                  ]}>
                    {selectedPostulant.statut === "affecte" && "Affecté"}
                    {selectedPostulant.statut === "refuse" && "Refusé"}
                    {selectedPostulant.statut === "en_attente" && "En attente"}
                  </Text>
                </View>
              </View>

              <View style={styles.profileDetails}>
                <View style={styles.profileField}>
                  <Text style={styles.profileValue}>{selectedPostulant.prenom}</Text>
                </View>
                <View style={styles.profileField}>
                  <Text style={styles.profileValue}>{selectedPostulant.nom}</Text>
                </View>
                <View style={styles.profileField}>
                  <Text style={styles.profileValue}>{selectedPostulant.email}</Text>
                </View>
                <View style={styles.profileField}>
                  <Text style={styles.profileValue}>Né(e) le {selectedPostulant.dateNaissance}</Text>
                </View>
                <View style={styles.profileField}>
                  <Text style={styles.profileValue}>{selectedPostulant.biographie}</Text>
                </View>
                <TouchableOpacity style={styles.profileField}>
                  <Text style={styles.profileLink}>Lien Github</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.competencesSection}>
                <Text style={styles.competencesTitle}>Compétences</Text>
                <View style={styles.competencesList}>
                  {selectedPostulant.competences.map((comp: string, idx: number) => (
                    <View key={idx} style={styles.competenceTagLarge}>
                      <Text style={styles.competenceTextLarge}>{comp}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Boutons d'action selon le statut */}
              <View style={styles.actionButtons}>
                {selectedPostulant.statut === "en_attente" && (
                  <>
                    <TouchableOpacity 
                      style={styles.affectButton}
                      onPress={handleAffecterIntervenant}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.affectButtonText}>Affecter à l'étude</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.refuseButton}
                      onPress={handleRefuserCandidature}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.refuseButtonText}>Refuser la candidature</Text>
                    </TouchableOpacity>
                  </>
                )}

                {selectedPostulant.statut === "affecte" && (
                  <TouchableOpacity 
                    style={styles.removeFromStudyButton}
                    onPress={() => handleRetirerIntervenant(selectedPostulant)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.removeFromStudyButtonText}>Retirer de l'étude</Text>
                  </TouchableOpacity>
                )}

                {selectedPostulant.statut === "refuse" && (
                  <TouchableOpacity 
                    style={styles.reactivateFullButton}
                    onPress={() => handleReactiverCandidature(selectedPostulant)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.reactivateFullButtonText}>Réactiver la candidature</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity 
                style={styles.backToListButton}
                onPress={() => setSelectedPostulant(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.backToListButtonText}>Retour à la liste</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

        </View>
      </ScrollView>

      <FooterLogo />
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  postulantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postulantAffecte: {
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  postulantRefuse: {
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
    opacity: 0.7,
  },
  postulantInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  postulantDetails: {
    flex: 1,
  },
  postulantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  postulantNameRefuse: {
    color: "#64748B",
  },
  postulantEmail: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
  },
  competencesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  competenceTag: {
    backgroundColor: "#EBF4FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 2,
  },
  competenceText: {
    fontSize: 10,
    color: "#3B82F6",
    fontWeight: "500",
  },
  removeButton: {
    padding: 4,
  },
  reactivateButton: {
    padding: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 20,
  },
  profileContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  statutBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statutAffecte: {
    backgroundColor: "#DCFCE7",
  },
  statutRefuse: {
    backgroundColor: "#FEE2E2",
  },
  statutEnAttente: {
    backgroundColor: "#FEF3C7",
  },
  statutText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statutTextAffecte: {
    color: "#166534",
  },
  statutTextRefuse: {
    color: "#DC2626",
  },
  statutTextEnAttente: {
    color: "#D97706",
  },
  profileDetails: {
    marginBottom: 24,
  },
  profileField: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  profileValue: {
    fontSize: 16,
    color: "#64748B",
  },
  profileLink: {
    fontSize: 16,
    color: "#3B82F6",
  },
  competencesSection: {
    marginBottom: 24,
  },
  competencesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  competencesList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  competenceTagLarge: {
    backgroundColor: "#EBF4FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  competenceTextLarge: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
  },
  actionButtons: {
    marginBottom: 16,
  },
  affectButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  affectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  refuseButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  refuseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  removeFromStudyButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  removeFromStudyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  reactivateFullButton: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  reactivateFullButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  backToListButton: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  backToListButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
})

export default GererIntervenantsScreen