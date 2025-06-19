import type { Request, Response } from "express"
import { pool } from "../../utils/db"

export async function desinscrireEvenement(req: Request, res: Response) {
  try {
    const { Id_Event, ID_user } = req.body

    // Validation des champs obligatoires
    if (!Id_Event || !ID_user) {
      return res.status(400).json({
        message: "L'ID de l'événement et l'ID de l'utilisateur sont obligatoires",
      })
    }

    // Vérifier si l'utilisateur est bien inscrit à cet événement
    const [existingRows] = await pool.query("SELECT * FROM Participer WHERE Id_Event = ? AND ID_user = ?", [
      Id_Event,
      ID_user,
    ])

    if ((existingRows as any[]).length === 0) {
      return res.status(404).json({
        message: "Vous n'êtes pas inscrit à cet événement",
      })
    }

    // Supprimer l'inscription de la table Participer
    await pool.query("DELETE FROM Participer WHERE Id_Event = ? AND ID_user = ?", [Id_Event, ID_user])

    return res.status(200).json({
      message: "Désinscription réussie",
      success: true,
      data: {
        Id_Event,
        ID_user,
      },
    })
  } catch (err) {
    console.error("Erreur désinscription événement :", err)
    return res.status(500).json({ message: "Erreur lors de la désinscription de l'événement" })
  }
}
