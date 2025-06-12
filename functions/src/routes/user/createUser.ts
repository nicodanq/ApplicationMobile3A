import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function createUser(req: Request, res: Response) {
  const {
    prenom_user,
    nom_user,
    email_user,
    mdp_user,
    bio_user,
    github_user,
    dateNaissance,
    statut_user,
  } = req.body;

  if (!prenom_user || !nom_user || !email_user || !mdp_user || statut_user === undefined) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }

  try {
    // Vérifie si l'email est déjà utilisé
    const [existing] = await pool.query(
      "SELECT ID_user FROM user WHERE email_user = ?",
      [email_user]
    );

    if ((existing as any[]).length > 0) {
      return res.status(409).json({ message: "Email déjà utilisé." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(mdp_user, 10);

    const dateCreation = new Date();

    const [result] = await pool.query(
      `INSERT INTO user 
      (prenom_user, nom_user, email_user, mdp_user, bio_user, github_user, dateCreation_user, statut_user, dateNaissance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prenom_user,
        nom_user,
        email_user,
        hashedPassword,
        bio_user || null,
        github_user || null,
        dateCreation,
        statut_user,
        dateNaissance || null,
      ]
    );

    const newUserId = (result as any).insertId;

    return res
      .status(201)
      .json({ message: "Utilisateur créé avec succès", userId: newUserId });
  } catch (err) {
    console.error("Erreur MySQL :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
