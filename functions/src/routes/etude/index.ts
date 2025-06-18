import express from "express";
import { getAllEtudes } from "./getAllEtudes";
import { getAllEtudesAdmin } from "./getEtudeAdmin";
import { getEtudeByID } from "./getEtudeByID";
import { updateEtude } from './updateEtude';
import { updateEtudeStatus } from "./updateStatutEtude";


const router = express.Router();
router.get("/", getAllEtudes);
router.get("/admin", getAllEtudesAdmin)
router.put("/:id/statut", updateEtudeStatus)
router.put("/:id", updateEtude)
router.get("/:id", getEtudeByID);

export default router;
