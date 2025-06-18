import type { Request, Response } from "express"
import { pool } from "../../utils/db"

export async function updateEtude(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const {
      titre,
      description,
      prix,
      nbrIntervenant,
      dateDebut,
      dateFin,
      dateCreation,
      imageUrl,
      type,
      statut
    } = req.body

    // Validation des paramètres
    if (!id) {
      res.status(400).json({ message: "ID de l'étude manquant" })
      return
    }

    if (!titre || !description || !prix || !type) {
      res.status(400).json({ message: "Champs obligatoires manquants" })
      return
    }

    // Conversion du statut texte vers ID numérique
    const getStatutId = (statutText: string): number => {
      const statutMap: { [key: string]: number } = {
        "Pas commencée": 3,
        "En cours": 1,
        "Terminée": 2
      }
      return statutMap[statutText] || 3
    }

    // Conversion du type vers ID numérique
    const getTypeId = (typeText: string): number => {
      const typeMap: { [key: string]: number } = {
        "IT & Digital": 1,
        "Ingénierie des systèmes": 2,
        "Conseil": 3,
        "RSE": 4,
        "Digital & Culture": 5,
        "Traduction Technique": 6
      }
      return typeMap[typeText] || 1
    }

    console.log(`Mise à jour de l'étude ${id}`)

    // Vérifier que l'étude existe
    const [existingEtude] = await pool.query("SELECT Id_etude FROM Etude WHERE Id_etude = ?", [id])

    if (!Array.isArray(existingEtude) || existingEtude.length === 0) {
      res.status(404).json({ message: "Étude non trouvée" })
      return
    }

    // Mettre à jour l'étude
    const [result] = await pool.query(`
      UPDATE Etude 
      SET 
        titre_etude = ?,
        description_etude = ?,
        prix_etude = ?,
        nbrIntervenant = ?,
        dateDebut_etude = ?,
        dateFin_etude = ?,
        dateCreation_etude = ?,
        img_etude = ?,
        ID_statutE = ?
      WHERE Id_etude = ?
    `, [
      titre,
      description,
      parseFloat(prix),
      parseInt(nbrIntervenant),
      dateDebut,
      dateFin,
      dateCreation,
      imageUrl,
      getStatutId(statut),
      id
    ])

    // Mettre à jour le type dans la table PossederEtude
    await pool.query(`
      UPDATE PossederEtude 
      SET ID_typeEtude = ? 
      WHERE Id_etude = ?
    `, [getTypeId(type), id])

    // Vérifier que la mise à jour a bien eu lieu
    if (result && typeof result === "object" && "affectedRows" in result) {
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Aucune étude mise à jour" })
        return
      }
    }

    console.log(`Étude ${id} mise à jour avec succès`)

    res.status(200).json({
      success: true,
      message: "Étude mise à jour avec succès",
      etudeId: id
    })
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'étude:", err)
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l'étude" })
  }
}