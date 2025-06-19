import express from "express";
import { createEtude } from "./createEtude";
import { inscrireEtude } from "./inscriptionController";
import { cancelEtude } from "./cancelEtude";
import { getAllEtudes } from "./getAllEtudes";
import { getAllEtudesAdmin } from "./getEtudeAdmin";
import { getEtudeByID } from "./getEtudeByID";
import { getIntervenantsByEtude } from "./getIntervenantByEtude";
import { getUsersByEtude } from "./getUsersByEtude";
import { startEtude } from "./startEtude";
import { updateEtude } from './updateEtude';
import { updateEtudeStatus } from "./updateStatutEtude";

const router = express.Router();
router.get("/", getAllEtudes);
router.get("/admin", getAllEtudesAdmin)
router.put("/:id/status", updateEtudeStatus)
router.put("/:id", updateEtude)
router.post("/inscription/", inscrireEtude)
router.post("/", createEtude)
router.get("/:id", getEtudeByID);
router.get("/:id/users", getUsersByEtude);
router.post("/start/:id", startEtude);
router.post("/cancel/:id", cancelEtude);
router.get("/:etudeId/intervenants", getIntervenantsByEtude);

export default router;
