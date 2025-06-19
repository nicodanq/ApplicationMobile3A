import { Request, Response } from 'express';
import { pool } from '../../utils/db';

export async function getEtudeByID(req: Request, res: Response) {
  const etudeId = req.params.id;

  if (!etudeId) {
    return res.status(400).json({ message: "ID d'étude manquant" });
  }

  try {
    const [rows] = await pool.query<import('mysql2/promise').RowDataPacket[]>(`
      SELECT 
        e.Id_etude,
        e.titre_etude,
        e.description_etude,
        e.dateDebut_etude,
        e.dateFin_etude,
        e.prix_etude,
        e.img_etude,
        e.dateCreation_etude,
        e.nbrIntervenant,
        e.ID_statutE,
        t.typeEtude AS categorie
      FROM Etude e
      JOIN PossederEtude pe ON e.Id_etude = pe.Id_etude
      JOIN TypeEtude t ON pe.ID_typeEtude = t.ID_typeEtude
      WHERE e.Id_etude = ?
    `, [etudeId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Étude non trouvée" });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Erreur MySQL :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
