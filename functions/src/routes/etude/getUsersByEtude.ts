import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function getUsersByEtude(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID d'étude manquant" });
  }

  try {
    const [rows] = await pool.query(`
      SELECT 
        u.ID_user,
        u.prenom_user,
        u.nom_user,
        u.email_user,
        u.bio_user,
        u.github_user,
        e.coeff_retribution
      FROM Effectuer e
      JOIN User u ON e.ID_user = u.ID_user
      WHERE e.Id_etude = ?
    `, [id]);

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé pour cette étude" });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur MySQL :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
