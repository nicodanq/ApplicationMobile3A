import * as functions from "firebase-functions";
import { pool } from "../../utils/db";

export const getUserById = functions.https.onRequest(async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    res.status(400).send("ID utilisateur manquant");
    return;
  }
  try {
    const [rows] = await pool.query<any[]>("SELECT * FROM User WHERE ID_user = ?", [userId]);
    if (rows.length === 0) {
      res.status(404).send("Utilisateur non trouvé");
      return;
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Erreur MySQL :", err);
    res.status(500).send("Erreur serveur");
  }
});