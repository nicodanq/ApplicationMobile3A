import type { Request, Response } from "express"
import { pool } from "../../utils/db"

export async function getAllEtudesAdmin(_req: Request, res: Response): Promise<Response> {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.Id_etude,
        e.titre_etude,
        e.description_etude,
        e.dateDebut_etude,
        e.dateFin_etude,
        e.prix_etude,
        e.img_etude,
        e.dateCreation_etude,
        e.nbrIntervenant,
        e.ID_statutE,
        CASE 
          WHEN pe.ID_typeEtude = 1 THEN 'IT & Digital'
          WHEN pe.ID_typeEtude = 2 THEN 'Ingénierie des Systèmes'
          WHEN pe.ID_typeEtude = 3 THEN 'Conseil'
          WHEN pe.ID_typeEtude = 4 THEN 'RSE'
          WHEN pe.ID_typeEtude = 5 THEN 'Digital & Culture'
          WHEN pe.ID_typeEtude = 6 THEN 'Traduction Technique'
          ELSE 'Autre'
        END AS categorie
      FROM Etude e
      JOIN PossederEtude pe ON e.Id_etude = pe.Id_etude
      ORDER BY e.dateCreation_etude DESC
    `)

    res.statusCode = 200
    return res.json(rows)
  } catch (err) {
    console.error("Erreur MySQL :", err)
    res.statusCode = 500
    return res.json({ message: "Erreur serveur" })
  }
}
