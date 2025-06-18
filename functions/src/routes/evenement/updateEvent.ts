import { Request, Response } from 'express';
import { pool } from '../../utils/db';

export async function updateEvent(req: Request, res: Response) {
  const { id } = req.params;
  const {
    titre,
    description,
    date,
    horaire_debut,
    horaire_fin,
    lieu,
    ID_typeEvenement
  } = req.body;

  try {
    const [result] = await pool.query(
      `
      UPDATE Evenement
      SET 
        titre_Event = ?,
        description_Event = ?,
        date_Event = ?,
        horaire_debut = ?,
        horaire_fin = ?,
        lieu_Event = ?,
        ID_typeEvenement = ?
      WHERE Id_Event = ?
      `,
      [titre, description, date, horaire_debut, horaire_fin, lieu, ID_typeEvenement, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    return res.status(200).json({ message: "Événement modifié avec succès" });
  } catch (err) {
    console.error("Erreur MySQL :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
