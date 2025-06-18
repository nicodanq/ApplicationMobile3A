import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ✅ Type d'article (doit correspondre à celui utilisé dans ArticlesScreen)
export type Article = {
  id: string;
  title: string;
  description: string;
  image: string;
  readTime: number;
  category: string;
};

type ArticleItemProps = {
  article: Article;
  onPress?: (article: Article) => void; // Optionnel si tu veux le rendre cliquable
};

const ArticleItem: React.FC<ArticleItemProps> = ({ article, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(article)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: article.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {article.description}
        </Text>
        <View style={styles.footer}>
          <Ionicons name="time-outline" size={16} color="#64748B" />
          <Text style={styles.readTime}>{article.readTime} min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ArticleItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: "#E2E8F0",
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  description: {
    fontSize: 14,
    color: "#64748B",
    marginVertical: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  readTime: {
    marginLeft: 6,
    fontSize: 12,
    color: "#64748B",
  },
});
