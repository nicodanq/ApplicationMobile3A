import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function getEtudesByUser(req: Request, res: Response) {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "ID utilisateur manquant" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT 
        e.Id_etude,
        e.titre_etude,
        e.dateDebut_etude,
        e.dateFin_etude,
        e.description_etude,
        e.prix_etude,
        e.nbrIntervenant,
        e.img_etude,
        se.StatutE AS statut
      FROM Effectuer ef
      JOIN Etude e ON ef.Id_etude = e.Id_etude
      JOIN StatutEtude se ON e.ID_statutE = se.ID_statutE
      WHERE ef.ID_user = ?
      ORDER BY e.ID_statutE`,
      [userId]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des études de l'utilisateur :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
