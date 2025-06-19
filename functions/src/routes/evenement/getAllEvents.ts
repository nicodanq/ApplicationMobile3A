import type { Request, Response } from "express"
import type { RowDataPacket } from "mysql2"
import { pool } from "../../utils/db"

export async function getAllEvents(_req: Request, res: Response) {
  try {
    // Ajouter un ORDER BY pour trier les événements
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        Id_Event,
        titre_Event,
        description_Event,
        date_Event,
        horaire_Event,
        lieu_Event,
        ID_typeEvenement
      FROM Evenement 
      WHERE date_Event >= CURDATE()
      ORDER BY date_Event ASC
    `)

    return res.status(200).json(rows)
  } catch (err) {
    console.error("Erreur MySQL :", err)
    return res.status(500).json({
      message: "Erreur serveur",
      error: process.env.NODE_ENV === "development" ? (err as Error).message : undefined,
    })
  }
}

// Ajouter une fonction pour récupérer un événement spécifique
export async function getEventById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM Evenement WHERE Id_Event = ?", [id])

    if (rows.length === 0) {
      return res.status(404).json({ message: "Événement non trouvé" })
    }

    return res.status(200).json(rows[0])
  } catch (err) {
    console.error("Erreur MySQL :", err)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}
