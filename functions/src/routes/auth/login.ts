import * as bcrypt from 'bcrypt';
import * as functions from 'firebase-functions';
import { pool } from '../../utils/db';
import { signToken } from '../../utils/jwt';

export const loginUser = functions.https.onRequest(async (req, res) => {
  // Vérifie que la méthode est bien POST
  if (req.method !== "POST") {
    res.status(405).send("Méthode non autorisée");
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Email ou mot de passe manquant");
    return;
  }

  try {
    const [rows] = await pool.query<any[]>(
      "SELECT ID_user, email_user, mdp_user FROM User WHERE email_user = ?",
      [email]
    );

    if (rows.length === 0) {
      res.status(404).send("Utilisateur non trouvé");
      return;
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.mdp_user);

    if (!isMatch) {
      res.status(401).send("Mot de passe incorrect");
      return;
    }

    const token = signToken({ id: user.ID_user, email: user.email_user });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Erreur de connexion :", err);
    res.status(500).send("Erreur serveur");
  }
});
