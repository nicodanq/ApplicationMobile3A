import express from "express";
import getRole from "./getRole";
import getUser from "./getUser";
import getUserByEmail from "./getUserByEmail";
import getUserById from "./getUserById";
import getUserPasswordByEmail from "./getUserPasswordByEmail";

const router = express.Router();

router.get("/role", getRole);
router.get("/user", getUser); // À adapter si besoin
router.get("/email", getUserByEmail);
router.get("/id", getUserById);
router.get("/check", getUserPasswordByEmail); // ⚠️ à sécuriser

export default router;
