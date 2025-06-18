import express from 'express';
import { deleteArticle } from "./deleteArticle";
import { getAllArticles } from './getAllArticles';
import { updateArticle } from "./updateArticle";
import { createArticle } from './createArticle';

const router = express.Router();
router.get('/', getAllArticles);
router.put("/:id", updateArticle)
router.delete("/:id", deleteArticle)
router.post("/", createArticle)

export default router;