import express from 'express';
import { createParticiper } from './createParticiper';

const router = express.Router();

router.post("/create", createParticiper);;

export default router;