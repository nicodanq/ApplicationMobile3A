import express from 'express';
import { createEvent } from './createEvent';
import { getAllEvents } from './getAllEvents';

const router = express.Router();

router.get("/", getAllEvents);
router.post("/create", createEvent);

export default router;