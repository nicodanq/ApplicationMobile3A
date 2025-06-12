import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function updatePassword(req: Request, res: Response) {
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Ancien et nouveau mot de passe requis." });
  }

  try {
    // Récupération du mot de passe actuel hashé
    const [rows] = await pool.query("SELECT mdp_user FROM user WHERE ID_user = ?", [userId]);

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const hashedPassword = (rows as any)[0].mdp_user;

    const isMatch = await bcrypt.compare(oldPassword, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Ancien mot de passe incorrect." });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE user SET mdp_user = ? WHERE ID_user = ?", [newHashedPassword, userId]);

    return res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (err) {
    console.error("Erreur lors du changement de mot de passe :", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}
