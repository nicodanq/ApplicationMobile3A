// src/routes/user/getUsers.ts
import * as functions from 'firebase-functions';
import { pool } from '../../utils/db';

export const getUsers = functions.https.onRequest(async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM User");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur MySQL :", err);
    res.status(500).send("Erreur serveur");
  }
});