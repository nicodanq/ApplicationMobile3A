import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function getArticleByUser(req: Request, res: Response) {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM Article WHERE ID_user = ? AND favoris_article = TRUE",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No favorite articles found for this user" });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error("MySQL Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
