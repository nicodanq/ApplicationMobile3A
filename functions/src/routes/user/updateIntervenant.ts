import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function updateIntervenant(req: Request, res: Response) {
  const userId = Number(req.params.id); // ← Changé de userId à id
  const { etudeId, statut, prix } = req.body;

  if (!userId || !etudeId) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }

  try {
    await pool.query(
      `
      UPDATE Effectuer
      SET
        statutAffectation = COALESCE(?, statutAffectation),
        coeff_retribution = ?
      WHERE ID_user = ? AND Id_etude = ?
      `,
      [statut || null, prix !== undefined ? prix : null, userId, etudeId]
    );

    return res.status(200).json({ message: "Intervenant mis à jour" });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'intervenant :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
