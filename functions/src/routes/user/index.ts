import express from "express";
import { createUser } from "./createUser";
import { deleteUser } from "./deleteUser";
import { getAllRoles } from "./getAllRole";
import { getAllUsers } from "./getAllUser";
import { getArticleByUser } from "./getArticlebyUser";
import { getEtudesByUser } from "./getEtudeByUser";
import { getEventsByUser } from "./getEventsByUser";
import { getUserByEmail } from "./getUserByEmail";
import { getUserById } from "./getUserById";
import { getUserStats } from "./getUserStats";
import { updateIntervenant } from "./updateIntervenant";
import { updatePassword } from "./updatePasswordUser";
import { updateStatusUser } from "./UpdateStatusUser";
import { updateUser } from "./updateUser";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/id/:id", getUserById);
router.get("/email", getUserByEmail);
router.get("/role", getAllRoles);
router.post("/", createUser);
router.put("/update/:id", updateUser);
router.put("/updatePassword/:id", updatePassword);
router.delete("/delete/:id", deleteUser);
router.put("/updateStatus/:id", updateStatusUser);
router.get("/stats/:id", getUserStats);
router.get("/events/:id", getEventsByUser);
router.get("/articles/:id", getArticleByUser);
router.get("/etudes/:id", getEtudesByUser);
router.patch("/intervenant/:id", updateIntervenant);

export default router;
