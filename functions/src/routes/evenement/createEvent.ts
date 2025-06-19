import type { Request, Response } from "express"
import { pool } from "../../utils/db"

// Votre fonction existante getAllEvents
export async function getAllEvents(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query("SELECT * FROM Evenement")
    return res.status(200).json(rows)
  } catch (err) {
    console.error("Erreur MySQL :", err)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}

// Votre fonction existante inscrireEtude (gardez-la)
export async function inscrireEtude(req: Request, res: Response) {
  try {
    const { Id_etude, ID_user } = req.body

    // Validation des champs obligatoires
    if (!Id_etude || !ID_user) {
      return res.status(400).json({
        message: "L'ID de l'étude et l'ID de l'utilisateur sont obligatoires",
      })
    }

    // Vérifier si l'utilisateur est déjà inscrit à cette étude
    const [existingRows] = await pool.query("SELECT * FROM Effectuer WHERE Id_etude = ? AND ID_user = ?", [
      Id_etude,
      ID_user,
    ])

    if ((existingRows as any[]).length > 0) {
      return res.status(409).json({
        message: "Vous êtes déjà inscrit à cette étude",
      })
    }

    // Insérer l'inscription dans la table Effectuer
    await pool.query(
      "INSERT INTO Effectuer (Id_etude, ID_user, coeff_retribution) VALUES (?, ?, ?)",
      [Id_etude, ID_user, 1.0], // coeff_retribution par défaut à 1
    )

    return res.status(201).json({
      message: "Inscription réussie",
      data: {
        Id_etude,
        ID_user,
        coeff_retribution: 1.0,
      },
    })
  } catch (err) {
    console.error("Erreur inscription étude :", err)
    return res.status(500).json({ message: "Erreur lors de l'inscription à l'étude" })
  }
}

// NOUVELLE FONCTION - Ajoutez celle-ci
export async function inscrireEvenement(req: Request, res: Response) {
  try {
    const { Id_Event, ID_user } = req.body

    // Validation des champs obligatoires
    if (!Id_Event || !ID_user) {
      return res.status(400).json({
        message: "L'ID de l'événement et l'ID de l'utilisateur sont obligatoires",
      })
    }

    // Vérifier si l'utilisateur est déjà inscrit à cet événement
    const [existingRows] = await pool.query("SELECT * FROM Participer WHERE Id_Event = ? AND ID_user = ?", [
      Id_Event,
      ID_user,
    ])

    if ((existingRows as any[]).length > 0) {
      return res.status(409).json({
        message: "Vous êtes déjà inscrit à cet événement",
      })
    }

    // Insérer l'inscription dans la table Participer
    await pool.query("INSERT INTO Participer (Id_Event, ID_user) VALUES (?, ?)", [Id_Event, ID_user])

    return res.status(201).json({
      message: "Inscription réussie",
      success: true,
      data: {
        Id_Event,
        ID_user,
      },
    })
  } catch (err) {
    console.error("Erreur inscription événement :", err)
    return res.status(500).json({ message: "Erreur lors de l'inscription à l'événement" })
  }
}

// Fonction utilitaire pour convertir "14h30" en "14:30:00"
function convertHeureToTime(heureString: string): string {
  // Nettoyer la chaîne
  const cleaned = heureString.trim().toLowerCase()
  
  // Regex pour capturer les heures et minutes
  const match = cleaned.match(/^(\d{1,2})h(\d{2})?$/)
  
  if (!match) {
    throw new Error("Format d'heure invalide. Utilisez le format: 9h, 14h, 9h30, 14h45")
  }
  
  const heures = parseInt(match[1], 10)
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  
  // Validation des heures et minutes
  if (heures < 0 || heures > 23) {
    throw new Error("Les heures doivent être entre 0 et 23")
  }
  
  if (minutes < 0 || minutes > 59) {
    throw new Error("Les minutes doivent être entre 0 et 59")
  }
  
  // Formater en HH:MM:SS
  const heuresFormatted = heures.toString().padStart(2, '0')
  const minutesFormatted = minutes.toString().padStart(2, '0')
  
  return `${heuresFormatted}:${minutesFormatted}:00`
}


// NOUVELLE FONCTION - Créer un événement
export async function creerEvenement(req: Request, res: Response) {
  try {
    const { titre, description, date, horaire, lieu, typeEvenementId } = req.body

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

    // Insérer l'événement dans la base de données
    const [result] = await pool.query(
      "INSERT INTO Evenement (titre_Event, description_Event, date_Event, horaire_Event, lieu_Event, ID_typeEvenement) VALUES (?, ?, ?, ?, ?, ?)",
      [titre, description, date, timeFormatted, lieu, typeEvenementId],
    )

    const insertResult = result as any
    const newEventId = insertResult.insertId

    return res.status(201).json({
      message: "Événement créé avec succès",
      success: true,
      data: {
        Id_Event: newEventId,
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
    console.error("Erreur création événement :", err)
    return res.status(500).json({ message: "Erreur lors de la création de l'événement" })
  }
}
