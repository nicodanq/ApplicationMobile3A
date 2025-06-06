import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon profil</Text>
        <View style={styles.divider} />
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../../assets/images/EPF_Projets_Logo.png")}
            style={styles.avatar}
            accessibilityLabel="Photo de profil"
            defaultSource={require("../../../assets/images/EPF_Projets_Logo.png")}
          />
        </View>
        <Text style={styles.userName}>Lina BENABDELOUAHED</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} accessibilityLabel="Mes informations" accessibilityRole="button">
          <Text style={styles.actionButtonText}>Mes informations</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} accessibilityLabel="Paramètres" accessibilityRole="button">
          <Text style={styles.actionButtonText}>Paramètres</Text>
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/images/EPF_Projets_Logo.png")}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="EPF Projets logo"
        />
        <Text style={styles.logoText}>EPF Projets</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 30,
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 40,
  },
  actionButton: {
    backgroundColor: "#2C6B96",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingBottom: 40,
  },
  logo: {
    width: 30,
    height: 30,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C6B96",
  },
})

