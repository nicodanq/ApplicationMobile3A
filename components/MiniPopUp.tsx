// components/MiniBar.tsx
import React, { useEffect } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type MiniBarProps = {
  visible: boolean
  message: string
  onClose: () => void
  duration?: number
  color?: string
}

const MiniBar: React.FC<MiniBarProps> = ({
  visible,
  message,
  onClose,
  duration = 3000,
  color = "#10B981", // vert par défaut
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [visible])

  if (!visible) return null

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.text}>{message}</Text>
      <TouchableOpacity onPress={onClose}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

export default MiniBar

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 999,
  },
  text: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginRight: 12,
  },
})