import { Router } from "express";
import { pool } from "../../utils/db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM User");
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur MySQL :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
