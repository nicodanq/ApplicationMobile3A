"use client"
import api from "@/api/axiosClient";
import FooterLogo from "@/components/FooterLogo";
import { useSession } from "@/contexts/AuthContext";
import { useUserDetails } from "@/hooks/useUserDetails";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";


import DateTimePicker from "@react-native-community/datetimepicker";

const MesInformationsAdminScreen = () => {
  const isIOS = Platform.OS === "ios";
  const router = useRouter();
  const { user } = useSession();
  const { details, role, loading, error } = useUserDetails(user?.id ?? null);

  // États locaux pour l’édition des champs
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [dateNaissance, setDateNaissance] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  useEffect(() => {
    if (details) {
      setNom(details.nom_user || "");
      setPrenom(details.prenom_user || "");
      setEmail(details.email_user || "");
      setTelephone(details.telephone_user || "");
      setAdresse(details.adresse_user || "");
      setVille(details.ville_user || "");
      setCodePostal(details.code_postal_user || "");
      setBio(details.bio_user || "");
      setGithub(details.github_user || "");
      if (details.dateNaissance && !isNaN(Date.parse(details.dateNaissance))) {
        setDateNaissance(new Date(details.dateNaissance));
      }
    }
  }, [details]);

  if (loading) return <Text>Chargement...</Text>;
  if (error || !details) return <Text>Erreur de chargement</Text>;

 const handleSave = async () => {
  const updatedData = {
    nom_user: nom,
    prenom_user: prenom,
    email_user: email,
    telephone_user: telephone,
    adresse_user: adresse,
    ville_user: ville,
    code_postal_user: codePostal,
    bio_user: bio,
    github_user: github,
    dateNaissance: dateNaissance.toISOString().split("T")[0],
  };
  console.log("Données à mettre à jour :", dateNaissance.toISOString().split("T")[0]);
  console.log("Données à envoyer :", dateNaissance);
  try {
    await api.put(`/user/update/${user?.id}`, updatedData);
    alert("Modifications sauvegardées !");
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    alert("Une erreur est survenue");
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes informations</Text>
      </View>

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setShowPicker(false); // Ferme le picker quand on clique ailleurs
        }}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

          <View style={styles.scrollContent}>
            <Animated.View entering={FadeInDown.delay(100)} style={styles.avatarSection}>
              <Image
                source={{ uri: "https://as2.ftcdn.net/v2/jpg/03/32/59/65/1000_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg" }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>Changer la photo</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
              <Text style={styles.sectionTitle}>Informations personnelles</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom</Text>
                <TextInput
                  style={styles.input}
                  value={nom}
                  onChangeText={setNom}
                  placeholder="Votre nom"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Prénom</Text>
                <TextInput
                  style={styles.input}
                  value={prenom}
                  onChangeText={setPrenom}
                  placeholder="Votre prénom"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date de naissance</Text>
                <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
                  <Text>{formatDate(dateNaissance)}</Text>
                </TouchableOpacity>
                {showPicker && isIOS && (
                  <Modal transparent animationType="fade" visible={showPicker}>
                    <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
                      <View style={styles.modalBackground}>
                        <TouchableWithoutFeedback>
                          <View style={styles.pickerContainer}>
                            <DateTimePicker
                              value={dateNaissance}
                              mode="date"
                              display="spinner"
                              onChange={(_, selectedDate) => {
                                if (selectedDate) {
                                  setDateNaissance(selectedDate);
                                }
                              }}
                              style={{ backgroundColor: "#fff" }}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
                )}

                {showPicker && !isIOS && (
                  <DateTimePicker
                    value={dateNaissance}
                    mode="date"
                    display="default"
                    onChange={(_, selectedDate) => {
                      if (selectedDate) {
                        setDateNaissance(selectedDate);
                      }
                      setShowPicker(false);
                    }}
                  />
                )}

              </View>


              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Votre email"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  value={telephone}
                  onChangeText={setTelephone}
                  placeholder="Votre numéro de téléphone"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Rôle</Text>
                <View style={styles.roleContainer}>
                  <Text style={styles.roleText}>
                    {role === "admin" ? "Administrateur" : role === "intervenant" ? "Intervenant" : "Utilisateur"}
                  </Text>
                  <View style={styles.roleBadge}>
                    <Ionicons
                      name={
                        role === "admin"
                          ? "shield-checkmark"
                          : role === "intervenant"
                            ? "briefcase-outline"
                            : "person-outline"
                      }
                      size={16}
                      color="#10B981"
                    />
                  </View>
                </View>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
              <Text style={styles.sectionTitle}>Informations de contact</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Adresse</Text>
                <TextInput
                  style={styles.input}
                  value={adresse}
                  onChangeText={setAdresse}
                  placeholder="Votre adresse"
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ville</Text>
                <TextInput
                  style={styles.input}
                  value={ville}
                  onChangeText={setVille}
                  placeholder="Votre ville"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Code postal</Text>
                <TextInput
                  style={styles.input}
                  value={codePostal}
                  onChangeText={setCodePostal}
                  placeholder="Code postal"
                  keyboardType="numeric"
                />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
              <Text style={styles.sectionTitle}>Autres Informations</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={styles.input}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Votre bio"
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Lien GitHub</Text>
                <TextInput
                  style={styles.input}
                  value={github}
                  onChangeText={setGithub}
                  placeholder="Votre lien GitHub"
                />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400)}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Sauvegarder les modifications</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <FooterLogo />
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

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
  avatarSection: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  changePhotoButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#3B82F6",
    borderRadius: 20,
  },
  changePhotoText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
  },
  roleText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  roleBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
})

export default MesInformationsAdminScreen