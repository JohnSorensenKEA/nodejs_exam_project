import express from "express";
const router = express.Router();

import { createConnection } from "../database/connectSqlite.js";

/* Endpoints */
router.get("/getRecentMessages", async (req, res) => {
    const connection = await createConnection();
    const messages = await connection.all(`SELECT * FROM messages ORDER BY id DESC LIMIT 20`);
    connection.close();

    messages.reverse();

    res.send(messages);
});

/* Module exports */
export default router;