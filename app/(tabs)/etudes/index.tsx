"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

import FooterLogo from "@/components/FooterLogo"
import HeaderPage from "@/components/HeaderPage"
import { useRouter } from "expo-router"

interface StudyCardProps {
  title: string
  description: string
  image: any
  color: string 
  gradientColors: [string, string]
  onPress: () => void
}

const StudyCard: React.FC<StudyCardProps> = ({ title, description, image, color, gradientColors, onPress }) => {
  
  return (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8} onPress={onPress}>
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.cardImage} />
            <View style={styles.imageOverlay} />
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.cardTitle, { color }]}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>

            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={[styles.learnMoreText, { color }]}>En savoir plus</Text>
              <Ionicons name="arrow-forward" size={16} color={color} style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

export default function EtudesScreen() {
  const studiesData: {
    title: string
    description: string
    image: any
    color: string
    gradientColors: [string, string]
  }[] = [
    {
      title: "IT & Digital",
      description: "Formation complète en technologies numériques et développement informatique",
      image: require("../../../assets/images/EPF_Projets_Logo.png"),
      color: "#3B82F6",
      gradientColors: ["#EBF4FF", "#DBEAFE"],
    },
    {
      title: "Ingénierie des Systèmes",
      description: "Conception et optimisation de systèmes complexes industriels",
      image: require("../../../assets/images/EPF_Projets_Logo.png"),
      color: "#10B981",
      gradientColors: ["#ECFDF5", "#D1FAE5"],
    },
    {
      title: "Conseil",
      description: "Stratégie d'entreprise et accompagnement organisationnel",
      image: require("../../../assets/images/EPF_Projets_Logo.png"),
      color: "#EC4899",
      gradientColors: ["#FDF2F8", "#FCE7F3"],
    },
    {
      title: "Traduction technique",
      description: "Spécialisation en traduction de documents techniques et scientifiques",
      image: require("../../../assets/images/EPF_Projets_Logo.png"),
      color: "#06B6D4",
      gradientColors: ["#F0F9FF", "#E0F7FA"],
    },
  ]

  const router = useRouter()

  const handleCardPress = (title: string) => {
    router.push({
      pathname: "/(tabs)/etudes/[id]",
      params: { id: title },
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <HeaderPage title="Études" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {studiesData.map((study, index) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(index * 100).springify()}
          >
            <StudyCard
              title={study.title}
              description={study.description}
              image={study.image}
              color={study.color}
              gradientColors={study.gradientColors}
              onPress={() => handleCardPress(study.title)}
            />
          </Animated.View>
        ))}

        <FooterLogo />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
    minHeight: 120,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 12,
  },
  learnMoreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
  arrowIcon: {
    marginLeft: 4,
  },
})
