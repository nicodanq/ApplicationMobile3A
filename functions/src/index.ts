import express from "express";
import * as functions from "firebase-functions";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";

const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);

export const api = functions.https.onRequest(app);