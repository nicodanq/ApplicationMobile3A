import express from "express";
import * as functions from "firebase-functions";
import articleRouter from "./routes/article";
import authRouter from "./routes/auth";
import etudeRouter from "./routes/etude";
import evenementRouter from "./routes/evenement";
import participerRouter from "./routes/participer";
import PossederRouter from "./routes/posseder";
import userRouter from "./routes/user";

const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/etude", etudeRouter);
app.use("/article", articleRouter);
app.use("/evenement", evenementRouter);
app.use("/participer", participerRouter);
app.use("/posseder", PossederRouter);


export const api = functions.https.onRequest(app);