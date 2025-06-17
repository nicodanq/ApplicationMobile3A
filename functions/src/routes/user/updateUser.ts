import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function updateUser(req: Request, res: Response) {
  const userId = req.params.id;

  const {
    prenom_user,
    nom_user,
    email_user,
    bio_user,
    github_user,
    dateNaissance,
    telephone_user,
    adresse_user,
    ville_user,
    code_postal_user,
  } = req.body;

  if (!prenom_user || !nom_user || !email_user) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }

  try {
    const [result] = await pool.query(
      `UPDATE user
       SET prenom_user = ?,
           nom_user = ?,
           email_user = ?,
           bio_user = ?,
           github_user = ?,
           dateNaissance = ?,
           telephone_user = ?,
           adresse_user = ?,
           ville_user = ?,
           code_postal_user = ?
       WHERE ID_user = ?`,
      [
        prenom_user,
        nom_user,
        email_user,
        bio_user || null,
        github_user || null,
        dateNaissance || null,
        telephone_user || null,
        adresse_user || null,
        ville_user || null,
        code_postal_user || null,
        userId
      ]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    return res.status(200).json({ message: "Utilisateur mis à jour avec succès." });
  } catch (err) {
    console.error("Erreur MySQL :", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}
