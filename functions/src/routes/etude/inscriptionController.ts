import type { Request, Response } from "express"
import { pool } from "../../utils/db"

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
