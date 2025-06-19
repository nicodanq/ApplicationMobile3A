import express from "express";
import { createEtude } from "./createEtude";
import { getAllEtudes } from "./getAllEtudes";
import { getAllEtudesAdmin } from "./getEtudeAdmin";
import { inscrireEtude } from "./inscriptionController";
import { updateEtude } from './updateEtude';
import { updateEtudeStatus } from "./updateStatutEtude";

const router = express.Router();
router.get("/", getAllEtudes);
router.get("/admin", getAllEtudesAdmin)
router.put("/:id/status", updateEtudeStatus)
router.put("/:id", updateEtude)
router.post("/inscription/", inscrireEtude)
router.post("/", createEtude)

export default router;
