
import { Request, Response } from "express";
import { pool } from "../../utils/db";

// src/controllers/articleController.ts
export async function getAllArticles(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.Id_article,
        a.titre_article,
        a.description_article,
        a.datePublication_article,
        a.img_article,
        a.auteur_article,
        a.ID_user,
        a.readTime,
        t.typeArticle AS categorie
      FROM Article a
      JOIN PossederArticle pa ON a.Id_article = pa.Id_article
      JOIN TypeArticle t ON pa.ID_typeArticle = t.ID_typeArticle
    `);

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur MySQL :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
