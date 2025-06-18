import express from "express";
import { getAllEtudes } from "./getAllEtudes";
import { getAllEtudesAdmin } from "./getEtudeAdmin";
import { updateEtudeStatus } from "./updateStatutEtude";
import { updateEtude } from './updateEtude'

const router = express.Router();
router.get("/", getAllEtudes);
router.get("/admin", getAllEtudesAdmin)
router.put("/:id/statut", updateEtudeStatus)
router.put("/:id", updateEtude)

export default router;
