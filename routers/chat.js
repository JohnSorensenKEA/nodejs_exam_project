import express from "express";
const router = express.Router();

import { createConnection } from "../database/connectSqlite.js";

/* Endpoints */
router.get("/getRecentMessages", async (req, res) => {
    const connection = await createConnection();
    const messages = await connection.all(
        `SELECT messages.id, messages.text, messages.created_at, users.username 
        FROM messages
        INNER JOIN users
        ON messages.user_id = users.id
        ORDER BY messages.id DESC LIMIT 20`,
    );

    connection.close();

    messages.reverse();

    res.send(messages);
});

router.get("/getRecentMessages/:amount", async (req, res) => {
    const connection = await createConnection();
    const messages = await connection.all(
        `SELECT * FROM messages ORDER BY id DESC LIMIT ?`,
        [req.params.amount ?? 20],
    );
    connection.close();

    messages.reverse();

    res.send(messages);
});

/* Module exports */
export default router;
