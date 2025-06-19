import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function startEtude(req: Request, res: Response) {
  const etudeId = req.params.id;
  const selectedUsers = req.body.selectedUsers;

  console.log("📥 Reçu dans /etude/start");
  console.log("➡️ ID étude :", etudeId);
  console.log("👥 Utilisateurs sélectionnés :", selectedUsers);

  if (
    !etudeId ||
    !Array.isArray(selectedUsers) ||
    selectedUsers.some(
      (u) => typeof u.userId !== "number" || typeof u.coeff !== "number"
    )
  ) {
    console.log("❌ Données invalides reçues :", req.body);
    return res.status(400).json({ message: "Paramètres invalides" });
  }
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    console.log("🛠️ Mise à jour de l'étude en 'en cours'");
    await connection.query(
      `UPDATE Etude SET ID_statutE = 1 WHERE Id_etude = ?`,
      [etudeId]
    );
    console.log("🧹 Réinitialisation des affectations précédentes (refus)");
    await connection.query(
      `UPDATE Effectuer SET statutAffectation = 'refuse' WHERE Id_etude = ?`,
      [etudeId]
    );
    console.log("✅ Réaffectation des bons intervenants...");
    for (const { userId, coeff } of selectedUsers) {
      console.log(`🔁 Affecte ID_user=${userId} avec coeff=${coeff}`);
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
    console.log("🎉 Étude démarrée avec succès !");
    return res.status(200).json({ message: "Étude lancée et intervenants mis à jour" });
  } catch (error) {
    await connection.rollback();
    console.error("🔥 Erreur lors du démarrage de l'étude :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  } finally {
    connection.release();
  }
}
