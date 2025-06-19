import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function startEtude(req: Request, res: Response) {
  const etudeId = req.params.id;
  const selectedUsers = req.body.selectedUsers;

  if (
    !etudeId ||
    !Array.isArray(selectedUsers) ||
    selectedUsers.some(
      (u) => typeof u.userId !== "number" || typeof u.coeff !== "number"
    )
  ) {
    return res.status(400).json({ message: "Paramètres invalides" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Mettre l’étude en cours
    await connection.query(
      `UPDATE Etude SET ID_statutE = 1 WHERE Id_etude = ?`,
      [etudeId]
    );

    // 2. Tous les affectés deviennent "refusé"
    await connection.query(
      `UPDATE Effectuer SET statutAffectation = 'refuse' WHERE Id_etude = ?`,
      [etudeId]
    );

    // 3. Mettre les bons à "affecté" + mettre à jour leur coefficient
    for (const { userId, coeff } of selectedUsers) {
      await connection.query(
        `
        UPDATE Effectuer
        SET statutAffectation = 'affecte',
            coeff_retribution = ?
        WHERE Id_etude = ? AND ID_user = ?
        `,
        [coeff, etudeId, userId]
      );
    }

    await connection.commit();
    return res.status(200).json({ message: "Étude lancée et intervenants mis à jour" });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors du démarrage de l'étude :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  } finally {
    connection.release();
  }
}
