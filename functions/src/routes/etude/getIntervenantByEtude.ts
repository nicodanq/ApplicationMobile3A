import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function getIntervenantsByEtude(req: Request, res: Response) {
  const etudeId = Number(req.params.etudeId);
  if (!etudeId) return res.status(400).json({ message: "ID de l'étude invalide" });

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        u.ID_user AS id,
        u.prenom_user AS prenom,
        u.nom_user AS nom,
        u.email_user AS email,
        u.dateNaissance,
        u.bio_user AS biographie,
        u.github_user AS github,
        e.statutAffectation AS statut,
        e.coeff_retribution AS prix
      FROM Effectuer e
      JOIN User u ON e.ID_user = u.ID_user
      WHERE e.Id_etude = ?
      `,
      [etudeId]
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des intervenants :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
