import express from 'express';
import { deleteArticle } from "./deleteArticle";
import { getAllArticles } from './getAllArticles';
import { updateArticle } from "./updateArticle";
import { createArticle } from './createArticle';
import { getSuggestedArticle } from './getAllArticles';

const router = express.Router();
router.get('/', getAllArticles);
router.put("/:id", updateArticle)
router.delete("/:id", deleteArticle)
router.post("/", createArticle)
router.get("/suggested", getSuggestedArticle)

export default router;