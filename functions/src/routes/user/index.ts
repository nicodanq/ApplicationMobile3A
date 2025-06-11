import express from "express";
import { getAllRoles } from "./getAllRole";
import { getAllUsers } from "./getAllUser";
import { getUserByEmail } from "./getUserByEmail";
import { getUserById } from "./getUserById";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/id/:id", getUserById);
router.get("/email", getUserByEmail);
router.get("/role", getAllRoles);

export default router;
