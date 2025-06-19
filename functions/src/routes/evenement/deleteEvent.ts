import type { Request, Response } from "express"
import { pool } from "../../utils/db"

// Fonction pour annuler un événement (au lieu de le supprimer)
export async function annulerEvenement(req: Request, res: Response) {
  try {
    const { id } = req.params

    console.log("🚫 Début annulation événement ID:", id)

    // Vérifier que l'événement existe
    const [existingEvent] = await pool.query("SELECT * FROM Evenement WHERE Id_Event = ?", [id])
    if ((existingEvent as any[]).length === 0) {
      return res.status(404).json({
        message: "Événement non trouvé",
      })
    }

    const event = (existingEvent as any[])[0]
    console.log("📋 Événement trouvé:", event)

    // Vérifier si l'événement n'est pas déjà annulé
    if (event.description_Event.includes("ANNULÉ")) {
      return res.status(400).json({
        message: "Cet événement est déjà annulé",
      })
    }

    // Modifier la description pour ajouter "ANNULÉ" au début
    const nouvelleDescription = `ANNULÉ - ${event.description_Event}`

    // Mettre à jour l'événement avec la nouvelle description
    // On garde le même type d'événement mais on va gérer la couleur côté front-end
    const [updateResult] = await pool.query("UPDATE Evenement SET description_Event = ? WHERE Id_Event = ?", [
      nouvelleDescription,
      id,
    ])

    console.log("✅ Résultat de l'annulation:", updateResult)

    // Récupérer l'événement mis à jour pour confirmation
    const [updatedEvent] = await pool.query("SELECT * FROM Evenement WHERE Id_Event = ?", [id])
    console.log("📋 Événement après annulation:", (updatedEvent as any[])[0])

    return res.status(200).json({
      message: "Événement annulé avec succès",
      success: true,
      data: (updatedEvent as any[])[0],
    })
  } catch (err) {
    console.error("❌ Erreur annulation événement:", err)
    return res.status(500).json({
      message: "Erreur lors de l'annulation de l'événement",
      error: process.env.NODE_ENV === "development" ? (err as Error).message : undefined,
    })
  }
}

// Fonction pour réactiver un événement annulé
export async function reactiverEvenement(req: Request, res: Response) {
  try {
    const { id } = req.params

    console.log("🔄 Début réactivation événement ID:", id)

    // Vérifier que l'événement existe
    const [existingEvent] = await pool.query("SELECT * FROM Evenement WHERE Id_Event = ?", [id])
    if ((existingEvent as any[]).length === 0) {
      return res.status(404).json({
        message: "Événement non trouvé",
      })
    }

    const event = (existingEvent as any[])[0]
    console.log("📋 Événement trouvé:", event)

    // Vérifier si l'événement est bien annulé
    if (!event.description_Event.includes("ANNULÉ")) {
      return res.status(400).json({
        message: "Cet événement n'est pas annulé",
      })
    }

    // Retirer "ANNULÉ - " de la description
    const nouvelleDescription = event.description_Event.replace("ANNULÉ - ", "")

    // Mettre à jour l'événement avec la description originale
    const [updateResult] = await pool.query("UPDATE Evenement SET description_Event = ? WHERE Id_Event = ?", [
      nouvelleDescription,
      id,
    ])

    console.log("✅ Résultat de la réactivation:", updateResult)

    // Récupérer l'événement mis à jour pour confirmation
    const [updatedEvent] = await pool.query("SELECT * FROM Evenement WHERE Id_Event = ?", [id])
    console.log("📋 Événement après réactivation:", (updatedEvent as any[])[0])

    return res.status(200).json({
      message: "Événement réactivé avec succès",
      success: true,
      data: (updatedEvent as any[])[0],
    })
  } catch (err) {
    console.error("❌ Erreur réactivation événement:", err)
    return res.status(500).json({
      message: "Erreur lors de la réactivation de l'événement",
      error: process.env.NODE_ENV === "development" ? (err as Error).message : undefined,
    })
  }
}
