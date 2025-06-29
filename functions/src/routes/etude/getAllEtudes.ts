import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function getAllEtudes(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query(`
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
        CASE 
          WHEN pe.ID_typeEtude = 1 THEN 'IT & Digital'
          WHEN pe.ID_typeEtude = 2 THEN 'Ingénierie des Systèmes'
          WHEN pe.ID_typeEtude = 3 THEN 'Conseil'
          WHEN pe.ID_typeEtude = 4 THEN 'RSE'
          WHEN pe.ID_typeEtude = 5 THEN 'Digital & Culture'
          WHEN pe.ID_typeEtude = 6 THEN 'Traduction Technique'
          ELSE 'Autre'
        END AS categorie
      FROM Etude e
      JOIN PossederEtude pe ON e.Id_etude = pe.Id_etude
      WHERE e.ID_statutE = 3
      ORDER BY e.dateCreation_etude DESC
    `);

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur MySQL :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}