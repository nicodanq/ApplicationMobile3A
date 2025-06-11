import type React from "react"
import { Pressable, Text, StyleSheet, type ViewStyle, type TextStyle, ActivityIndicator } from "react-native"

interface ButtonProps {
  children: React.ReactNode
  variant?: "default" | "outline" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  onPress?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Button = ({
  children,
  variant = "default",
  size = "default",
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "outline":
        return styles.outline
      case "ghost":
        return styles.ghost
      case "link":
        return styles.link
      case "destructive":
        return styles.destructive
      default:
        return styles.default
    }
  }

  const getVariantTextStyle = (): TextStyle => {
    switch (variant) {
      case "outline":
        return styles.outlineText
      case "ghost":
        return styles.ghostText
      case "link":
        return styles.linkText
      case "destructive":
        return styles.destructiveText
      default:
        return styles.defaultText
    }
  }

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "sm":
        return styles.sm
      case "lg":
        return styles.lg
      case "icon":
        return styles.icon
      default:
        return styles.sizeDefault
    }
  }

  const getSizeTextStyle = (): TextStyle => {
    switch (size) {
      case "sm":
        return styles.smText
      case "lg":
        return styles.lgText
      default:
        return styles.sizeDefaultText
    }
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "default" ? "#fff" : "#000"} size="small" />
      ) : (
        <Text style={[styles.text, getVariantTextStyle(), getSizeTextStyle(), textStyle]}>{children}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  // Variants
  default: {
    backgroundColor: "#3B82F6", // blue-500
  },
  defaultText: {
    color: "#FFFFFF",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E2E8F0", // slate-200
  },
  outlineText: {
    color: "#1E293B", // slate-800
  },
  ghost: {
    backgroundColor: "transparent",
  },
  ghostText: {
    color: "#1E293B", // slate-800
  },
  link: {
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  linkText: {
    color: "#3B82F6", // blue-500
    textDecorationLine: "underline",
  },
  destructive: {
    backgroundColor: "#EF4444", // red-500
  },
  destructiveText: {
    color: "#FFFFFF",
  },
  // Sizes
  sizeDefault: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sizeDefaultText: {
    fontSize: 14,
  },
  sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  smText: {
    fontSize: 12,
  },
  lg: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  lgText: {
    fontSize: 16,
  },
  icon: {
    width: 40,
    height: 40,
    padding: 0,
  },
  // States
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
})
