// src/utils/db.ts
import * as dotenv from 'dotenv';
import * as mysql from 'mysql2/promise';
dotenv.config();

export const pool = mysql.createPool({
  host: "192.168.0.48",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "application3A",
});
