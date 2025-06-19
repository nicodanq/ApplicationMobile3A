import type { Request, Response } from "express"
import { pool } from "../../utils/db"

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
