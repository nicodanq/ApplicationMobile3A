import express from "express";
import { getAllEtudes } from "./getAllEtudes";

const router = express.Router();
router.get("/", getAllEtudes);

export default router;
