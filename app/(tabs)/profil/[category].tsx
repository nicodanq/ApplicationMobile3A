"use client"

import api from "@/api/axiosClient";
import { useSession } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Study = {
    Id_etude: number;
    titre_etude: string;
    dateDebut_etude: string;
    dateFin_etude: string;
    description_etude: string;
    prix_etude: number;
    nbrIntervenant: number;
    img_etude: string;
    statut: string;
};

const EtudesCategorieScreen = () => {
    const { category } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useSession();
    const [studies, setStudies] = useState<Study[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const res = await api.get(`/user/etudes/${user?.id}`);
                const allStudies: Study[] = res.data;
                const filtered = allStudies.filter((etude) => {
                    if (category === "postulees") return etude.statut === "Pas commencée";
                    if (category === "enCours") return etude.statut === "En cours";
                    if (category === "terminees") return etude.statut === "Terminée";
                });
                setStudies(filtered);
            } catch (err) {
                console.error("Erreur :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudies();
    }, [category]);

    type CategoryType = "postulees" | "enCours" | "terminees";
    const titleMap: Record<CategoryType, string> = {
        postulees: "Études postulées",
        enCours: "Études en cours",
        terminees: "Études terminées"
    };

    const safeCategory = (category: string | string[] | undefined): CategoryType => {
        if (category === "postulees" || category === "enCours" || category === "terminees") {
            return category;
        }
        return "postulees";
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <SafeAreaView style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{titleMap[safeCategory(category as string)]}</Text>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scroll}>
                {loading ? (
                    <Text style={{ textAlign: "center", marginTop: 30 }}>Chargement...</Text>
                ) : studies.length === 0 ? (
                    <Text style={{ textAlign: "center", marginTop: 30 }}>Aucune étude trouvée.</Text>
                ) : (
                    studies.map((study) => (
                        <TouchableOpacity
                            key={study.Id_etude}
                            style={styles.card}
                            onPress={() => {
                                console.log(study.Id_etude, "studyId");
                                console.log("ID envoyé grace params:", study.Id_etude.toString())
                                router.push({
                                    pathname: "/profil/detail_etude/[id]",
                                    params: { id: study.Id_etude.toString() }
                                });
                            }}
                            activeOpacity={0.8}
                        >
                            <Image source={{ uri: study.img_etude }} style={styles.image} />
                            <View style={styles.content}>
                                <Text style={styles.title}>{study.titre_etude}</Text>
                                <Text style={styles.date}>
                                    {new Date(study.dateDebut_etude).toLocaleDateString("fr-FR")} ➝{" "}
                                    {new Date(study.dateFin_etude).toLocaleDateString("fr-FR")}
                                </Text>
                                <Text numberOfLines={3} style={styles.description}>
                                    {study.description_etude}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default EtudesCategorieScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    scroll: {
        padding: 16,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 16,
        elevation: 2,
    },
    image: {
        width: "100%",
        height: 160,
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: "#6B7280",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: "#374151",
    },
});
