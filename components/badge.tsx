import type React from "react"
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from "react-native"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "outline" | "destructive"
  style?: ViewStyle
  textStyle?: TextStyle
  className?: string
}

export const Badge = ({ children, variant = "default", style, textStyle }: BadgeProps) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "secondary":
        return styles.secondary
      case "outline":
        return styles.outline
      case "destructive":
        return styles.destructive
      default:
        return styles.default
    }
  }

  const getVariantTextStyle = (): TextStyle => {
    switch (variant) {
      case "secondary":
        return styles.secondaryText
      case "outline":
        return styles.outlineText
      case "destructive":
        return styles.destructiveText
      default:
        return styles.defaultText
    }
  }

  return (
    <View style={[styles.badge, getVariantStyle(), style]}>
      <Text style={[styles.text, getVariantTextStyle(), textStyle]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
  // Variants
  default: {
    backgroundColor: "#3B82F6", // blue-500
  },
  defaultText: {
    color: "#FFFFFF",
  },
  secondary: {
    backgroundColor: "#F1F5F9", // slate-100
  },
  secondaryText: {
    color: "#64748B", // slate-500
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E2E8F0", // slate-200
  },
  outlineText: {
    color: "#64748B", // slate-500
  },
  destructive: {
    backgroundColor: "#FEE2E2", // red-100
  },
  destructiveText: {
    color: "#EF4444", // red-500
  },
})
