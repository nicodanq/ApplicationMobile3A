import express from "express";
import { createUser } from "./createUser";
import { getAllRoles } from "./getAllRole";
import { getAllUsers } from "./getAllUser";
import { getUserByEmail } from "./getUserByEmail";
import { getUserById } from "./getUserById";
import { updatePassword } from "./updatePasswordUser";
import { updateUser } from "./updateUser";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/id/:id", getUserById);
router.get("/email", getUserByEmail);
router.get("/role", getAllRoles);
router.post("/", createUser);
router.put("/update/:id", updateUser);
router.put("/updatePassword/:id", updatePassword);

export default router;
