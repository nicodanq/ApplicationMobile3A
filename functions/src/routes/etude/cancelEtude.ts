import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function cancelEtude(req: Request, res: Response) {
  console.log("🛬 Reçu dans /etude/cancel:", req.body);
  const etudeId = (req.params.id);
  if (!etudeId) {
    return res.status(400).json({ message: "ID de l'étude manquant ou invalide" });
  }
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Repasser l'étude en "Pas commencée" (ID_statutE = 3)
    await connection.query(
      `UPDATE Etude SET ID_statutE = 3 WHERE Id_etude = ?`,
      [etudeId]
    );

    // 2. Remettre tous les intervenants à "en_attente"
    await connection.query(
      `UPDATE Effectuer SET statutAffectation = 'en_attente', coeff_retribution = NULL WHERE Id_etude = ?`,
      [etudeId]
    );

    await connection.commit();
    return res.status(200).json({ message: "Lancement de l'étude annulé avec succès" });
  } catch (error) {
    console.log("🔥 body reçu:", req.body)
    await connection.rollback();
    console.error("Erreur lors de l'annulation de l'étude :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  } finally {
    connection.release();
  }
}
