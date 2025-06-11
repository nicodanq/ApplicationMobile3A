// src/utils/db.ts
import * as dotenv from 'dotenv';
import * as mysql from 'mysql2/promise';
dotenv.config();

export const pool = mysql.createPool({
  host: "172.20.10.3",
  user: "firebaseuser",
  password: "firebase123",
  database: "application3A",
});
