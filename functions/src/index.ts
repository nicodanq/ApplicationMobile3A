import * as functions from 'firebase-functions';
import * as mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: "10.1.120.58",
  user: "firebaseuser",
  password: "firebase123",
  database: "application3A",
});

export const getUsers = functions.https.onRequest(async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM User");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur MySQL :", err);
    res.status(500).send("Erreur serveur");
  }
});

export const getUserById = functions.https.onRequest(async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    res.status(400).send("ID utilisateur manquant");
    return;
  }
  try {
    const [rows] = await pool.query<any[]>("SELECT * FROM User WHERE id = ?", [userId]);
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

export const getUserByEmail = functions.https.onRequest(async (req, res) => {
  const email = req.query.email;
  if (!email) {
    res.status(400).send("Email manquant");
    return;
  }
  try {
    const [rows] = await pool.query<any[]>("SELECT * FROM User WHERE email = ?", [email]);
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


export const getRoles = functions.https.onRequest(async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Role");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur MySQL :", err);
    res.status(500).send("Erreur serveur");
  }
});
