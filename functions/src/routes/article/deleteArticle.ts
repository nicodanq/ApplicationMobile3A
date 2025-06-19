import type { Request, Response } from "express"
import { pool } from "../../utils/db"

export async function deleteArticle(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params

    // Validation des paramètres
    if (!id) {
      res.status(400).json({ message: "ID de l'article manquant" })
      return
    }

    console.log(`Suppression de l'article ${id}`)

    // Vérifier que l'article existe
    const [existingArticle] = await pool.query("SELECT Id_article, titre_article FROM Article WHERE Id_article = ?", [
      id,
    ])

    if (!Array.isArray(existingArticle) || existingArticle.length === 0) {
      res.status(404).json({ message: "Article non trouvé" })
      return
    }

    // Commencer une transaction pour supprimer l'article et ses relations
    await pool.query("START TRANSACTION")

    try {
      // Supprimer d'abord les relations dans PossederArticle
      await pool.query("DELETE FROM PossederArticle WHERE Id_article = ?", [id])

      // Supprimer l'article principal
      const [result] = await pool.query("DELETE FROM Article WHERE Id_article = ?", [id])

      // Vérifier que la suppression a bien eu lieu
      if (result && typeof result === "object" && "affectedRows" in result) {
        if (result.affectedRows === 0) {
          await pool.query("ROLLBACK")
          res.status(404).json({ message: "Aucun article supprimé" })
          return
        }
      }

      // Valider la transaction
      await pool.query("COMMIT")

      console.log(`Article ${id} supprimé avec succès`)

      res.status(200).json({
        success: true,
        message: "Article supprimé avec succès",
        articleId: id,
      })
    } catch (transactionError) {
      // Annuler la transaction en cas d'erreur
      await pool.query("ROLLBACK")
      throw transactionError
    }
  } catch (err) {
    console.error("Erreur lors de la suppression de l'article:", err)
    res.status(500).json({ message: "Erreur serveur lors de la suppression de l'article" })
  }
}
