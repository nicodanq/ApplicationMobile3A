import { Router } from "express";
import { pool } from "../../utils/db";

const router = Router();

router.get("/", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: "Email manquant" });

  try {
    const [rows] = await pool.query("SELECT * FROM User WHERE email_user = ?", [email]) as [import('mysql2/promise').RowDataPacket[], any];
    if (rows.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Erreur MySQL :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
