// src/utils/db.ts
import * as dotenv from 'dotenv';
import * as mysql from 'mysql2/promise';
dotenv.config();

export const pool = mysql.createPool({
  host: "192.168.179.224",
  user: "firebaseuser",
  password: "firebase123",
  database: "application3A",
});
