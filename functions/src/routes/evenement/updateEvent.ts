import type { Request, Response } from "express"
import { pool } from "../../utils/db"

// Fonction utilitaire pour convertir "14h30" en "14:30:00"
function convertHeureToTime(heureString: string): string {
  // Nettoyer la chaîne
  const cleaned = heureString.trim().toLowerCase()

  // Regex pour capturer les heures et minutes
  const match = cleaned.match(/^(\d{1,2})h(\d{2})?$/)

  if (!match) {
    throw new Error("Format d'heure invalide. Utilisez le format: 9h, 14h, 9h30, 14h45")
  }

  const heures = Number.parseInt(match[1], 10)
  const minutes = match[2] ? Number.parseInt(match[2], 10) : 0

  // Validation des heures et minutes
  if (heures < 0 || heures > 23) {
    throw new Error("Les heures doivent être entre 0 et 23")
  }

  if (minutes < 0 || minutes > 59) {
    throw new Error("Les minutes doivent être entre 0 et 59")
  }

  // Formater en HH:MM:SS
  const heuresFormatted = heures.toString().padStart(2, "0")
  const minutesFormatted = minutes.toString().padStart(2, "0")

  return `${heuresFormatted}:${minutesFormatted}:00`
}

// Fonction pour modifier un événement
export async function modifierEvenement(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { titre, description, date, horaire, lieu, typeEvenementId } = req.body

    console.log("🔄 Début modification événement ID:", id)
    console.log("📝 Données reçues:", { titre, description, date, horaire, lieu, typeEvenementId })

    // Validation des champs obligatoires
    if (!titre || !description || !date || !horaire || !lieu || !typeEvenementId) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires (titre, description, date, horaire, lieu, typeEvenementId)",
      })
    }

    // Validation de la longueur des champs (selon votre schéma VARCHAR(50))
    if (titre.length > 50) {
      return res.status(400).json({
        message: "Le titre ne peut pas dépasser 50 caractères",
      })
    }

    if (description.length > 50) {
      return res.status(400).json({
        message: "La description ne peut pas dépasser 50 caractères",
      })
    }

    if (lieu.length > 50) {
      return res.status(400).json({
        message: "Le lieu ne peut pas dépasser 50 caractères",
      })
    }

    // Validation du format de date (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        message: "Format de date invalide. Utilisez YYYY-MM-DD",
      })
    }

    // Vérifier que la date n'est pas dans le passé
    const eventDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (eventDate < today) {
      return res.status(400).json({
        message: "La date de l'événement ne peut pas être dans le passé",
      })
    }

    // Conversion et validation de l'horaire
    let timeFormatted: string
    try {
      timeFormatted = convertHeureToTime(horaire)
      console.log("⏰ Heure convertie:", horaire, "→", timeFormatted)
    } catch (error: any) {
      return res.status(400).json({
        message: `Erreur dans l'horaire: ${error.message}`,
      })
    }

    // Validation du type d'événement (doit être 1, 2, ou 3)
    if (![1, 2, 3].includes(typeEvenementId)) {
      return res.status(400).json({
        message: "Type d'événement invalide. Utilisez 1 (Formation), 2 (Afterwork), ou 3 (Forum)",
      })
    }

    // Vérifier que l'événement existe
    const [existingEvent] = await pool.query("SELECT * FROM Evenement WHERE Id_Event = ?", [id])
    if ((existingEvent as any[]).length === 0) {
      return res.status(404).json({
        message: "Événement non trouvé",
      })
    }

    console.log("📋 Événement existant trouvé:", (existingEvent as any[])[0])

    // Mettre à jour l'événement dans la base de données
    const [updateResult] = await pool.query(
      "UPDATE Evenement SET titre_Event = ?, description_Event = ?, date_Event = ?, horaire_Event = ?, lieu_Event = ?, ID_typeEvenement = ? WHERE Id_Event = ?",
      [titre, description, date, timeFormatted, lieu, typeEvenementId, id],
    )

    console.log("✅ Résultat de la mise à jour:", updateResult)

    // Récupérer l'événement mis à jour pour confirmation
    const [updatedEvent] = await pool.query("SELECT * FROM Evenement WHERE Id_Event = ?", [id])
    console.log("📋 Événement après mise à jour:", (updatedEvent as any[])[0])

    return res.status(200).json({
      message: "Événement modifié avec succès",
      success: true,
      data: {
        Id_Event: id,
        titre_Event: titre,
        description_Event: description,
        date_Event: date,
        horaire_Event: timeFormatted,
        horaire_Display: horaire, // Garder l'original pour l'affichage
        lieu_Event: lieu,
        ID_typeEvenement: typeEvenementId,
      },
    })
  } catch (err) {
    console.error("❌ Erreur modification événement:", err)
    return res.status(500).json({
      message: "Erreur lors de la modification de l'événement",
      error: process.env.NODE_ENV === "development" ? (err as Error).message : undefined,
    })
  }
}
