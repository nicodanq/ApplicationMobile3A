import { Response,Request } from "express";
import { pool } from "../../utils/db";

export async function updateEtudeStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const { statut } = req.body

    // Validation des paramètres
    if (!id) {
      res.status(400).json({ message: "ID de l'étude manquant" })
      return
    }

    if (statut === undefined || statut === null) {
      res.status(400).json({ message: "Statut manquant" })
      return
    }

    // Validation du statut (doit être 1, 2, 3 ou 4)
    if (![1, 2, 3, 4].includes(Number.parseInt(statut))) {
      res.status(400).json({ message: "Statut invalide. Doit être 1, 2, 3 ou 4" })
      return
    }

    console.log(`Mise à jour du statut de l'étude ${id} vers ${statut}`)

    // Vérifier que l'étude existe
    const [existingEtude] = await pool.query("SELECT Id_etude FROM Etude WHERE Id_etude = ?", [id])

    if (!Array.isArray(existingEtude) || existingEtude.length === 0) {
      res.status(404).json({ message: "Étude non trouvée" })
      return
    }

    // Mettre à jour le statut
    const [result] = await pool.query("UPDATE Etude SET ID_statutE = ? WHERE Id_etude = ?", [
      Number.parseInt(statut),
      id,
    ])

    // Vérifier que la mise à jour a bien eu lieu
    if (result && typeof result === "object" && "affectedRows" in result) {
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Aucune étude mise à jour" })
        return
      }
    }

    console.log(`Statut de l'étude ${id} mis à jour avec succès vers ${statut}`)

    res.status(200).json({
      success: true,
      message: "Statut mis à jour avec succès",
      etudeId: id,
      nouveauStatut: Number.parseInt(statut),
    })
  } catch (err) {
    console.error("Erreur lors de la mise à jour du statut:", err)
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du statut" })
  }
}
