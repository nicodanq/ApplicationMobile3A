import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function getAllArticles(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query("SELECT * FROM Article");
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur MySQL :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}