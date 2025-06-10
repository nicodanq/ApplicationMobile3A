import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function getUserByEmail(req: Request, res: Response) {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: "Email manquant" });

  try {
    const [rows] = await pool.query("SELECT * FROM User WHERE email_user = ?", [email]);
    if ((rows as any[]).length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur MySQL :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
