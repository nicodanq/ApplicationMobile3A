// 📁 /functions/src/routes/auth/login.ts
import { Request, Response, Router } from "express";
import { pool } from "../../utils/db";
import { signToken } from "../../utils/jwt";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "Email manquant" });
  if (!password) return res.status(400).json({ message: "Mdp manquant" });

  console.log("Tentative de connexion pour :", email);
  try {
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM User WHERE email_user = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    // const isMatch = await bcrypt.compare(password, rows[0].mdp_user);
    const isMatch = password === rows[0].mdp_user;
    if (!isMatch)
      return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = signToken({
      id: rows[0].ID_user,
      email: rows[0].email_user,
    });

    const user = {
      id: rows[0].ID_user,
      email: rows[0].email_user,
    };
    console.log("Connexion réussie pour :", email);
    return res.status(200).json({ token, ...user });
  } catch (err) {
    console.error("Erreur MySQL ou interne :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
