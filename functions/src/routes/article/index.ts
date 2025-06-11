import express from 'express';
import { getAllArticles } from './getAllArticles';
const router = express.Router();
router.get('/', getAllArticles);
export default router;