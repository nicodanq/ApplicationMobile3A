import type { Request, Response } from "express"
import { pool } from "../../utils/db"

export async function updateArticle(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const {
      titre_article,
      description_article,
      datePublication_article,
      img_article,
      auteur_article,
      categorie,
      readTime,
    } = req.body

    // Validation des paramètres
    if (!id) {
      res.status(400).json({ message: "ID de l'article manquant" })
      return
    }

    if (!titre_article || !description_article || !auteur_article) {
      res.status(400).json({ message: "Titre, description et auteur sont obligatoires" })
      return
    }

    console.log(`Mise à jour de l'article ${id}`)

    // Vérifier que l'article existe
    const [existingArticle] = await pool.query("SELECT Id_article FROM Article WHERE Id_article = ?", [id])

    if (!Array.isArray(existingArticle) || existingArticle.length === 0) {
      res.status(404).json({ message: "Article non trouvé" })
      return
    }

    // Mettre à jour l'article
    const [result] = await pool.query(
      `
      UPDATE Article 
      SET 
        titre_article = ?,
        description_article = ?,
        datePublication_article = ?,
        img_article = ?,
        auteur_article = ?,
        readTime = ?
      WHERE Id_article = ?
    `,
      [
        titre_article,
        description_article,
        datePublication_article || new Date().toISOString().split("T")[0],
        img_article || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
        auteur_article,
        readTime || 5,
        id,
      ],
    )

    // Vérifier que la mise à jour a bien eu lieu
    if (result && typeof result === "object" && "affectedRows" in result) {
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Aucun article mis à jour" })
        return
      }
    }

    // Mettre à jour la catégorie si nécessaire
    if (categorie) {
      // D'abord, récupérer l'ID du type d'article
      const [typeResult] = await pool.query("SELECT ID_typeArticle FROM TypeArticle WHERE typeArticle = ?", [categorie])

      if (Array.isArray(typeResult) && typeResult.length > 0) {
        const typeId = (typeResult[0] as any).ID_typeArticle

        // Mettre à jour la relation dans PossederArticle
        await pool.query(
          `
          UPDATE PossederArticle 
          SET ID_typeArticle = ? 
          WHERE Id_article = ?
        `,
          [typeId, id],
        )
      }
    }

    console.log(`Article ${id} mis à jour avec succès`)

    res.status(200).json({
      success: true,
      message: "Article mis à jour avec succès",
      articleId: id,
    })
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'article:", err)
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l'article" })
  }
}
