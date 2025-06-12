import React from "react"
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native"

// Props pour composants basés sur View
interface ViewCardProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  className?: string
}

// Props pour composants basés sur Text
interface TextCardProps {
  children: React.ReactNode
  style?: StyleProp<TextStyle>
  className?: string
}

export const Card = ({ children, style }: ViewCardProps) => {
  return <View style={[styles.card, style]}>{children}</View>
}

export const CardHeader = ({ children, style }: ViewCardProps) => {
  return <View style={[styles.cardHeader, style]}>{children}</View>
}

export const CardTitle = ({ children, style }: TextCardProps) => {
  return <Text style={[styles.cardTitle, style]}>{children}</Text>
}

export const CardDescription = ({ children, style }: TextCardProps) => {
  return <Text style={[styles.cardDescription, style]}>{children}</Text>
}

export const CardContent = ({ children, style }: ViewCardProps) => {
  return <View style={[styles.cardContent, style]}>{children}</View>
}

export const CardFooter = ({ children, style }: ViewCardProps) => {
  return <View style={[styles.cardFooter, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0", // slate-200
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9", // slate-100
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B", // slate-800
  },
  cardDescription: {
    fontSize: 14,
    color: "#64748B", // slate-500
    marginTop: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9", // slate-100
    flexDirection: "row",
    justifyContent: "flex-end",
  },
})
