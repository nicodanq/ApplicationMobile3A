import express from "express";
import { loginHandler } from "./login";

const router = express.Router();
router.post("/", loginHandler);

export default router;
