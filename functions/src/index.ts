import * as functions from 'firebase-functions';
import * as mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "application3A",
});

// Define the expected row type
interface QuoteRow {   //TypeScript helper: tells the compiler that each row returned by your query has a single string column called text.
  text: string;
}

export const getQuotes = functions.https.onRequest(async (req, res) => {
    try {
        const quotes = await pool.query("SELECT ID_role FROM Role WHERE ID_role = 1");  // ** pool.query sends the SQL to MySQL. await pauses the function until MySQL replies.  Destructuring grabs only the first item (rows) out of the [rows, fields] tuple that mysql2 returns.
        res.status(200).json({ quotes });
    } catch (error) {
        console.error("Error fetching quotes", error);
        res.status(500).send("Server Error");
    }
}

);
