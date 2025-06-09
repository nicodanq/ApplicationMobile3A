import * as bcrypt from 'bcrypt';
import * as functions from 'firebase-functions';
import { pool } from '../../utils/db';
import { signToken } from '../../utils/jwt';

export const getUserPasswordByEmailLogin = functions.https.onRequest(async (req, res) => {
  const email = typeof req.query.email === "string" ? req.query.email : undefined;
  const password = typeof req.query.password === "string" ? req.query.password : undefined;
  if (!email) {
    res.status(400).send("Email manquant");
    return;
  }
  if (!password) {
    res.status(400).send("Mot de passe manquant");
    return;
  }
  try {
    const [rows] = await pool.query<any[]>("SELECT * FROM User WHERE email_user = ?", [email]);
    if (rows.length === 0) {
      res.status(404).send("Utilisateur non trouvé");
      return;
    }
    const ismatch = await bcrypt.compare(password, rows[0].mdp_user);
    if (!ismatch) {
      res.status(401).send("Mot de passe incorrect");
      return;
    }
    const token = signToken({ id: rows[0].ID_user, email: rows[0].email_user });
    // Si le mot de passe est correct, on renvoie les informations de l'utilisateur 
    // Note: Il est préférable de ne pas renvoyer le mot de passe, même s'il est haché.
    delete rows[0].mdp_user; // Supprimer le mot de passe haché de la réponse 
    res.status(200).json({
      token,
      id: rows[0].ID_user,
      email: rows[0].email_user,
    });
  } catch (err) {
    console.error("Erreur MySQL :", err);
    res.status(500).send("Erreur serveur");
  }
});