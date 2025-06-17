"use client"

import api from "@/api/axiosClient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import FooterLogo from "@/components/FooterLogo";


const { width, height } = Dimensions.get("window")


// Données fictives des utilisateurs


const GererUtilisateursScreen = () => {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [searchText, setSearchText] = useState("")

  const filteredUsers = users.filter(user =>
    user.prenom_user.toLowerCase().includes(searchText.toLowerCase()) ||
    user.nom_user.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email_user.toLowerCase().includes(searchText.toLowerCase())
  )

  const [loading, setLoading] = useState(true)

  useFocusEffect(
    React.useCallback(() => {
      const fetchUsers = async () => {
        setLoading(true)
        try {
          const response = await api.get("/user")
          setUsers(response.data)
        } catch (error) {
          console.error("Erreur lors du chargement des utilisateurs :", error)
        } finally {
          setLoading(false)
        }
      }

      fetchUsers()
    }, [])
  )

  const handleUserPress = (user: any) => {
    setSelectedUser(user)
    setModalVisible(true)
  }

  const handleToggleStatus = async (userId: number) => {
    const updatedUsers = users.map(user =>
      user.ID_user === userId
        ? { ...user, statut_user: !user.statut_user }
        : user
    );
    setUsers(updatedUsers);

    const updatedUser = updatedUsers.find(u => u.ID_user === userId);
    setSelectedUser(updatedUser ?? null);

    try {
      await api.put(`/user/updateStatus/${userId}`, {
        statut_user: updatedUser?.statut_user,
      });

      Alert.alert(
        "Succès",
        `L'utilisateur a été ${updatedUser?.statut_user ? "activé" : "désactivé"}`
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      Alert.alert(
        "Erreur",
        "Impossible de mettre à jour le statut de l'utilisateur"
      );
      // Optionnel : rollback en cas d'erreur
      setUsers(users);
      setSelectedUser(selectedUser);
    }
  };


  const handleDeleteUser = async (userId: number) => {
    console.log("Suppression de l'utilisateur avec ID :", userId)
    await api.delete(`/user/delete/${userId}`)
    Alert.alert(
      "Supprimer l'utilisateur",
      "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            setUsers(prev => prev.filter(user => user.ID_user !== userId))
            setModalVisible(false)
            Alert.alert("Succès", "L'utilisateur a été supprimé")
          }
        }
      ]
    )
  }

  const UserCard = ({ user }: { user: any }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleUserPress(user)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.prenom_user} {user.nom_user}</Text>
        <Text style={styles.userEmail}>{user.email_user}</Text>
        <Text style={styles.userDate}>
          Inscrit le {new Date(user.dateCreation_user).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.userStatus}>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: user.statut_user ? "#10B981" : "#EF4444" }
        ]} />
        <Text style={[
          styles.statusText,
          { color: user.statut_user ? "#10B981" : "#EF4444" }
        ]}>
          {user.statut_user ? "Actif" : "Inactif"}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const UserModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header du modal */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Profil utilisateur</Text>
              <View style={{ width: 24 }} />
            </View>

            {selectedUser && (
              <>
                {/* Photo et nom */}
                <View style={styles.modalProfileSection}>
                  <Image source={{ uri: selectedUser.avatar }} style={styles.modalAvatar} />
                  <Text style={styles.modalUserName}>
                    {selectedUser.prenom_user} {selectedUser.nom_user}
                  </Text>
                  <View style={[
                    styles.modalStatusBadge,
                    { backgroundColor: selectedUser.statut_user ? "#DCFCE7" : "#FEE2E2" }
                  ]}>
                    <Text style={[
                      styles.modalStatusText,
                      { color: selectedUser.statut_user ? "#166534" : "#DC2626" }
                    ]}>
                      {selectedUser.statut_user ? "Compte actif" : "Compte inactif"}
                    </Text>
                  </View>
                </View>

                {/* Informations détaillées */}
                <View style={styles.modalDetailsSection}>
                  <View style={styles.modalDetailItem}>
                    <View style={styles.modalDetailIcon}>
                      <Ionicons name="person-outline" size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.modalDetailContent}>
                      <Text style={styles.modalDetailLabel}>Prénom</Text>
                      <Text style={styles.modalDetailValue}>{selectedUser.prenom_user}</Text>
                    </View>
                  </View>

                  <View style={styles.modalDetailItem}>
                    <View style={styles.modalDetailIcon}>
                      <Ionicons name="person-outline" size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.modalDetailContent}>
                      <Text style={styles.modalDetailLabel}>Nom</Text>
                      <Text style={styles.modalDetailValue}>{selectedUser.nom_user}</Text>
                    </View>
                  </View>

                  <View style={styles.modalDetailItem}>
                    <View style={styles.modalDetailIcon}>
                      <Ionicons name="mail-outline" size={20} color="#10B981" />
                    </View>
                    <View style={styles.modalDetailContent}>
                      <Text style={styles.modalDetailLabel}>Email</Text>
                      <Text style={styles.modalDetailValue}>{selectedUser.email_user}</Text>
                    </View>
                  </View>

                  <View style={styles.modalDetailItem}>
                    <View style={styles.modalDetailIcon}>
                      <Ionicons name="calendar-outline" size={20} color="#F59E0B" />
                    </View>
                    <View style={styles.modalDetailContent}>
                      <Text style={styles.modalDetailLabel}>Date de naissance</Text>
                      <Text style={styles.modalDetailValue}>
                        {new Date(selectedUser.dateNaissance).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalDetailItem}>
                    <View style={styles.modalDetailIcon}>
                      <Ionicons name="time-outline" size={20} color="#8B5CF6" />
                    </View>
                    <View style={styles.modalDetailContent}>
                      <Text style={styles.modalDetailLabel}>Date d&apos;inscription</Text>
                      <Text style={styles.modalDetailValue}>
                        {new Date(selectedUser.dateCreation_user).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalDetailItem}>
                    <View style={styles.modalDetailIcon}>
                      <Ionicons name="document-text-outline" size={20} color="#06B6D4" />
                    </View>
                    <View style={styles.modalDetailContent}>
                      <Text style={styles.modalDetailLabel}>Biographie</Text>
                      <Text style={styles.modalDetailValue}>{selectedUser.bio_user}</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.modalDetailItem}>
                    <View style={styles.modalDetailIcon}>
                      <Ionicons name="logo-github" size={20} color="#374151" />
                    </View>
                    <View style={styles.modalDetailContent}>
                      <Text style={styles.modalDetailLabel}>GitHub</Text>
                      <Text style={[styles.modalDetailValue, styles.linkText]}>
                        {selectedUser.github_user}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Actions */}
                <View style={styles.modalActions}>
                  <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Statut</Text>
                    <Switch
                      value={selectedUser?.statut_user}
                      onValueChange={() => handleToggleStatus(selectedUser.ID_user)}
                      thumbColor={selectedUser?.statut_user ? "#10B981" : "#EF4444"}
                      trackColor={{ false: "#FECACA", true: "#BBF7D0" }}
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.modalActionButton, styles.deleteButton]}
                    onPress={() => handleDeleteUser(selectedUser.ID_user)}
                  >
                    <Ionicons name="trash-outline" size={20} color="white" />
                    <Text style={styles.modalActionText}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

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
        <Text style={styles.headerTitle}>Gestion des utilisateurs</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/profil/creer-utilisateur')}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Statistiques */}
      <Animated.View entering={FadeInUp.delay(100)} style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{users.filter(u => u.statut_user).length}</Text>
          <Text style={styles.statLabel}>Actifs</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{users.filter(u => !u.statut_user).length}</Text>
          <Text style={styles.statLabel}>Inactifs</Text>
        </View>
      </Animated.View>

      {/* Barre de recherche */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un utilisateur..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </Animated.View>

      {/* Liste des utilisateurs */}
      <FlatList
        data={filteredUsers}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(300 + index * 50)}>
            <UserCard user={item} />
          </Animated.View>
        )}
        keyExtractor={(item) => item.ID_user.toString()}
        style={styles.usersList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.usersListContent}
      />

      {/* Modal de profil utilisateur */}
      <UserModal />

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
    marginHorizontal: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#000000",
  },
  usersList: {
    flex: 1,
    marginTop: 20,
  },
  usersListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
  },
  userDate: {
    fontSize: 12,
    color: "#94A3B8",
  },
  userStatus: {
    alignItems: "center",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  // Styles du modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  modalProfileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  modalUserName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  modalStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  modalDetailsSection: {
    marginBottom: 24,
  },
  modalDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalDetailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  modalDetailContent: {
    flex: 1,
  },
  modalDetailLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
  },
  modalDetailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  linkText: {
    color: "#3B82F6",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  modalActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#EF4444",
  },

  deleteButton: {
    flexShrink: 1,
  },

  modalActionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },

  switchContainer: {
    alignItems: "center",
    marginLeft: 16,
  },

  switchLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },

})

export default GererUtilisateursScreen