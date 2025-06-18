import express from 'express';
import { createEvent } from './createEvent';
import { getAllEvents } from './getAllEvents';
import { deleteEvent } from './deleteEvent';
import { updateEvent } from './updateEvent';


const router = express.Router();

router.get("/", getAllEvents);
router.post("/create", createEvent);
router.delete("/:id", deleteEvent)
router.put("/:id", updateEvent);


export default router;