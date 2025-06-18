"use client"

import React, { createContext, useContext } from "react"
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Context pour gérer l'état du dialogue
interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export const Dialog = ({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>
}

interface DialogTriggerProps {
  children: React.ReactElement<{ onPress?: () => void }>
  asChild?: boolean
}

export const DialogTrigger = ({ children, asChild }: DialogTriggerProps) => {
  const context = useContext(DialogContext)
  if (!context) throw new Error("DialogTrigger must be used within a Dialog")

  if (asChild) {
    return React.cloneElement(children, {
      onPress: () => context.onOpenChange(true),
    })
  }

  return <Pressable onPress={() => context.onOpenChange(true)}>{children}</Pressable>
}


export const DialogContent = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(DialogContext)
  if (!context) throw new Error("DialogContent must be used within a Dialog")

  const { width, height } = Dimensions.get("window")
  const maxWidth = Math.min(width - 32, 500)
  const maxHeight = height * 0.8

  return (
    <Modal visible={context.open} transparent animationType="fade" onRequestClose={() => context.onOpenChange(false)}>
      <TouchableWithoutFeedback onPress={() => context.onOpenChange(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={[styles.content, { maxWidth, maxHeight }]}>
              <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <View style={styles.innerContent}>{children}</View>
              </ScrollView>
              <Pressable style={styles.closeButton} onPress={() => context.onOpenChange(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.header}>{children}</View>
}

export const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <Text style={styles.title}>{children}</Text>
}

export const DialogDescription = ({ children }: { children: React.ReactNode }) => {
  return <Text style={styles.description}>{children}</Text>
}

export const DialogFooter = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.footer}>{children}</View>
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: "relative",
  },
  innerContent: {
    padding: 24,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#64748B",
  },
  footer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
})
