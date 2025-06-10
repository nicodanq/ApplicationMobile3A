import { Request, Response } from "express";
import { pool } from "../../utils/db";

export interface User {
  ID_user: number;
  prenom_user: string;
  nom_user: string;
  email_user: string;
  mdp_user: string;
  bio_user: string;
  github_user: string;
  dateCreation_user: string; // ou Date si tu veux parser
  statut_user: number;
  dateNaissance: string; // ou Date aussi
}

export async function getUserById(req: Request, res: Response) {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "ID utilisateur manquant" });

  try {
    const [rows] = await pool.query(
      "SELECT * FROM user WHERE ID_user = ?",
      [id]
    );

    const users = rows as User[];
    if (users.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
    return res.status(200).json(users[0]); // ✅ front recevra un objet, pas un tableau
  } catch (err) {
    console.error("Erreur MySQL :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
