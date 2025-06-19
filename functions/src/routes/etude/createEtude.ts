import type { Request, Response } from "express"
import { pool } from "../../utils/db"

// Votre fonction existante getAllEtudesAdmin
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

// Nouvelle fonction pour créer une étude
export async function createEtude(req: Request, res: Response) {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const {
      titre_etude,
      description_etude,
      dateDebut_etude,
      dateFin_etude,
      prix_etude,
      nbrIntervenant,
      img_etude,
      typeEtude,
    } = req.body

    // Validation des champs obligatoires
    if (!titre_etude || !description_etude || !prix_etude || !typeEtude) {
      return res.status(400).json({
        message: "Les champs titre, description, prix et type d'étude sont obligatoires",
      })
    }

    // Mapper le type d'étude vers l'ID
    const typeMapping: { [key: string]: number } = {
      "IT & Digital": 1,
      "Ingénierie des Systèmes": 2,
      Conseil: 3,
      RSE: 4,
      "Digital & Culture": 5,
      "Traduction Technique": 6,
    }

    const typeEtudeId = typeMapping[typeEtude]
    if (!typeEtudeId) {
      return res.status(400).json({
        message: "Type d'étude invalide",
      })
    }

    // 1. Insérer l'étude dans la table Etude
    const [etudeResult] = await connection.query(
      `
      INSERT INTO Etude (
        dateDebut_etude,
        dateFin_etude,
        prix_etude,
        description_etude,
        titre_etude,
        dateCreation_etude,
        nbrIntervenant,
        ID_statutE,
        img_etude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        dateDebut_etude || new Date().toISOString().split("T")[0],
        dateFin_etude || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // +30 jours par défaut
        Number.parseFloat(prix_etude) || 0,
        description_etude,
        titre_etude,
        new Date().toISOString().split("T")[0], // dateCreation_etude
        Number.parseInt(nbrIntervenant) || 1,
        3, // ID_statutE = 3 (Pas commencée)
        img_etude || "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=200&fit=crop",
      ],
    )

    const etudeId = (etudeResult as any).insertId

    // 2. Lier l'étude à son type dans la table PossederEtude
    await connection.query(
      `
      INSERT INTO PossederEtude (Id_etude, ID_typeEtude) VALUES (?, ?)
    `,
      [etudeId, typeEtudeId],
    )

    await connection.commit()

    // 3. Récupérer l'étude créée avec sa catégorie
    const [newEtude] = await connection.query(
      `
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
      WHERE e.Id_etude = ?
    `,
      [etudeId],
    )

    return res.status(201).json({
      message: "Étude créée avec succès",
      etude: (newEtude as any[])[0],
    })
  } catch (err) {
    await connection.rollback()
    console.error("Erreur création étude :", err)
    return res.status(500).json({ message: "Erreur lors de la création de l'étude" })
  } finally {
    connection.release()
  }
}
