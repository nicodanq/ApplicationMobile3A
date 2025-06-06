import * as functions from 'firebase-functions';
import { pool } from '../../utils/db';

export const getUserByEmail = functions.https.onRequest(async (req, res) => {
  const email = req.query.email;
  if (!email) {
    res.status(400).send("Email manquant");
    return;
  }
  try {
    const [rows] = await pool.query<any[]>("SELECT * FROM User WHERE email_user = ?", [email]);
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