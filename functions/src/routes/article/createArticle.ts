import type { Request, Response } from "express"
import { pool } from "../../utils/db"

export async function createArticle(req: Request, res: Response) {
  try {
    const {
      titre_article,
      description_article,
      datePublication_article,
      img_article,
      auteur_article,
      readTime,
      categorie,
      ID_user,
    } = req.body

    // Validation des champs obligatoires
    if (!titre_article || !description_article || !auteur_article || !categorie) {
      return res.status(400).json({
        message: "Les champs titre, description, auteur et catégorie sont obligatoires",
      })
    }

    // 1. Vérifier si la catégorie existe
    const [categoryRows] = await pool.query("SELECT ID_typeArticle FROM TypeArticle WHERE typeArticle = ?", [categorie])

    let categoryId
    if ((categoryRows as any[]).length === 0) {
      // Créer la catégorie si elle n'existe pas
      const [categoryResult] = await pool.query("INSERT INTO TypeArticle (typeArticle) VALUES (?)", [categorie])
      categoryId = (categoryResult as any).insertId
    } else {
      categoryId = (categoryRows as any[])[0].ID_typeArticle
    }

    // 2. Insérer l'article
    const [articleResult] = await pool.query(
      `INSERT INTO Article (
        titre_article, 
        description_article, 
        datePublication_article, 
        img_article, 
        auteur_article, 
        ID_user, 
        readTime
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        titre_article,
        description_article,
        datePublication_article || new Date().toISOString().split("T")[0],
        img_article || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
        auteur_article,
        ID_user || 1,
        readTime || 5,
      ],
    )

    const articleId = (articleResult as any).insertId

    // 3. Lier l'article à sa catégorie
    await pool.query("INSERT INTO PossederArticle (Id_article, ID_typeArticle) VALUES (?, ?)", [articleId, categoryId])

    return res.status(201).json({
      message: "Article créé avec succès",
      articleId: articleId,
    })
  } catch (err) {
    console.error("Erreur création article :", err)
    return res.status(500).json({ message: "Erreur lors de la création de l'article" })
  }
}
