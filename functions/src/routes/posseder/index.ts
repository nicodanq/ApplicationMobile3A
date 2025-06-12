import express from "express";
import { roleByIdUser } from "./roleByIdUser";
const router = express.Router();
router.get("/role/:userId", roleByIdUser);
export default router;