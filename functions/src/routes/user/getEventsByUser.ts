import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function getEventsByUser(req: Request, res: Response) {
  const userId = req.params.id;

  if (!userId) return res.status(400).json({ message: "ID utilisateur manquant" });

  try {
    const [rows] = await pool.query(
      `SELECT 
      e.Id_Event,
      e.titre_Event, 
      e.date_Event,
      e.horaire_Event,
      e.lieu_Event,            -- ✅ ajout de l'adresse
      te.typeEvent AS typeEvent
   FROM Participer p
   JOIN Evenement e ON p.Id_Event = e.Id_Event
   JOIN TypeEvenement te ON e.ID_typeEvenement = te.ID_typeEvenement
   WHERE p.ID_user = ?`,
      [userId]
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des événements :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
