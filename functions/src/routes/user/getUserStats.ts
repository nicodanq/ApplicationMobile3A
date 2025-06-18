import { Request, Response } from "express";
import { pool } from "../../utils/db";

export async function getUserStats(req: Request, res: Response) {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "ID utilisateur manquant" });
  }

  try {
    // 1. Nombre d’études faites (table Effectuer)
    const [etudeResult] = await pool.query(
      "SELECT COUNT(*) AS etudes FROM Effectuer WHERE ID_user = ?",
      [userId]
    );

    // 2. Nombre d’articles écrits (table Article)
    const [articleResult] = await pool.query(
      "SELECT COUNT(*) AS articles FROM Article WHERE ID_user = ?",
      [userId]
    );

    // 3. Nombre de participations à des événements (table Participer)
    const [eventResult] = await pool.query(
      "SELECT COUNT(*) AS participations FROM Participer WHERE ID_user = ?",
      [userId]
    );

    return res.status(200).json({
      etudes: (etudeResult as any)[0].etudes,
      articles: (articleResult as any)[0].articles,
      participations: (eventResult as any)[0].participations,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des stats utilisateur :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
