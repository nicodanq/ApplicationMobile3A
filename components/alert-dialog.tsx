"use client"

import React, { createContext, useContext } from "react"
import { Modal, View, Text, Pressable, StyleSheet, TouchableWithoutFeedback, Dimensions } from "react-native"
import { Button } from "./button"

// Context pour gérer l'état du dialogue d'alerte
interface AlertDialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined)

export const AlertDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  return <AlertDialogContext.Provider value={{ open, onOpenChange: setOpen }}>{children}</AlertDialogContext.Provider>
}

export const AlertDialogTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  const context = useContext(AlertDialogContext)
  if (!context) throw new Error("AlertDialogTrigger must be used within an AlertDialog")

  if (asChild && React.isValidElement(children)) {
    // Vérifier que children.props est un objet et a les bonnes propriétés
    const childProps = children.props as any
    const originalOnPress = childProps?.onPress

    return React.cloneElement(children, {
      ...(typeof childProps === "object" && childProps !== null ? childProps : {}),
      onPress: () => {
        // Appeler le onPress original s'il existe et est une fonction
        if (typeof originalOnPress === "function") {
          originalOnPress()
        }
        context.onOpenChange(true)
      },
    } as any)
  }

  return <Pressable onPress={() => context.onOpenChange(true)}>{children}</Pressable>
}

export const AlertDialogContent = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(AlertDialogContext)
  if (!context) throw new Error("AlertDialogContent must be used within an AlertDialog")

  const { width } = Dimensions.get("window")
  const maxWidth = Math.min(width - 32, 500)

  return (
    <Modal visible={context.open} transparent animationType="fade" onRequestClose={() => context.onOpenChange(false)}>
      <TouchableWithoutFeedback>
        <View style={styles.overlay}>
          <View style={[styles.content, { maxWidth }]}>{children}</View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export const AlertDialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.header}>{children}</View>
}

export const AlertDialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <Text style={styles.title}>{children}</Text>
}

export const AlertDialogDescription = ({ children }: { children: React.ReactNode }) => {
  return <Text style={styles.description}>{children}</Text>
}

export const AlertDialogFooter = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.footer}>{children}</View>
}

export const AlertDialogCancel = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(AlertDialogContext)
  if (!context) throw new Error("AlertDialogCancel must be used within an AlertDialog")

  return (
    <Button variant="outline" onPress={() => context.onOpenChange(false)}>
      {children || "Cancel"}
    </Button>
  )
}

export const AlertDialogAction = ({
  children,
  onPress,
  className,
}: {
  children: React.ReactNode
  onPress?: () => void
  className?: string
}) => {
  const context = useContext(AlertDialogContext)
  if (!context) throw new Error("AlertDialogAction must be used within an AlertDialog")

  const handlePress = () => {
    if (onPress) onPress()
    context.onOpenChange(false)
  }

  return (
    <Button onPress={handlePress} style={{ backgroundColor: "#EF4444" }}>
      {children || "Continue"}
    </Button>
  )
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
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
    marginBottom: 16,
  },
  footer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
})
