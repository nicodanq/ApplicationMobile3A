import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function createEvent(req: Request, res: Response) {
  const { titre, description, date, horaire_debut, horaire_fin, lieu, typeEvenementId } = req.body;

  // Validation des champs obligatoires
  if (!titre || !description || !date || !horaire_debut || !horaire_fin || !lieu || !typeEvenementId) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO Evenement (
        titre_Event,
        description_Event,
        date_Event,
        horaire_debut,
        horaire_fin,
        lieu_Event,
        ID_typeEvenement
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [titre, description, date, horaire_debut, horaire_fin, lieu, typeEvenementId]
    );

    return res.status(201).json({
      message: "Événement créé",
      eventId: (result as any).insertId
    });
  } catch (err) {
    console.error("Erreur MySQL :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
