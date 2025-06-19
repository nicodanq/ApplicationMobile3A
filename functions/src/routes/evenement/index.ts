import express from 'express';
import { getAllEvents } from './getAllEvents';
import { inscrireEvenement } from './participationController';
import { creerEvenement } from './createEvent';
import { modifierEvenement } from './updateEvent';
import { annulerEvenement, reactiverEvenement } from './deleteEvent';
import { desinscrireEvenement } from './desinscrireEvent';

const router = express.Router();

router.get("/", getAllEvents);
router.post("/inscrire", inscrireEvenement)
router.post('/creer', creerEvenement);
router.put('/:id', modifierEvenement)
router.put('/annuler/:id', annulerEvenement)
router.put('/reactiver/:id', reactiverEvenement)
router.delete('/desinscrire', desinscrireEvenement)


export default router;