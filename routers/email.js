import "dotenv/config";

import express from "express";
const router = express.Router();

import { createConnection } from "../database/connectSqlite.js";

import escapeHTML from "../util/escapeHTML.js";

/* Nodemailer setup */
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/* Endpoints */
router.get("/api/email/getEmails", async (req, res) => {
    const connection = await createConnection();

    const emails = await connection.all(
        `SELECT e.id, e.subject, e.body, e.system_message, e.created_at, COUNT(ue.email_id) AS reference_count 
        FROM emails e
        LEFT JOIN user_emails ue ON ue.email_id = e.id
        GROUP BY e.id
        ORDER BY e.id DESC`,
    );
    connection.close();
    res.status(200).send(emails);
});

router.get("/api/email/getEmail/:id", async (req, res) => {
    const connection = await createConnection();

    email = await connection.get(
        `SELECT e.id, e.subject, e.body, e.system_message, e.created_at, COUNT(ue.email_id) AS reference_count 
        FROM emails e
        LEFT JOIN user_emails ue ON ue.email_id = e.id
        WHERE id = ?
        GROUP BY e.id`,
        [req.params.id],
    );
    connection.close();
    res.status(200).send(email);
});

router.post("/api/contact", async (req, res) => {
    res.status(201);
    const connection = await createConnection();
    let systemMessage = "[system: email]";

    try {
        const email = await connection.get(
            `INSERT INTO emails ('subject', 'body', 'system_message')
            VALUES (?, ?, ?)
            RETURNING *`,
            [escapeHTML(req.body.title), escapeHTML(req.body.message), ""],
        );

        for (const id of req.body.userIds) {
            const user = await connection.get(
                `SELECT id, email FROM users
                WHERE id = ?`,
                [id],
            );
            if (user == undefined) {
                systemMessage += `\nUnknown user [id: ${id}]`;
                continue;
            }

            try {
                await new Promise((resolve, reject) => {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: user.email,
                        subject: escapeHTML(req.body.title),
                        text: `${escapeHTML(req.body.message)}\n\nsent: ${Date()}`,
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(info);
                        }
                    });
                });
                systemMessage += `\nSuccessfully sent email to [id: ${user.id}, email: ${user.email}]`;
                await connection.run(`INSERT INTO user_emails VALUES (?, ?)`, [
                    user.id,
                    email.id,
                ]);
            } catch (error) {
                res.status(503);
                systemMessage += `\nFailed sending email to [id: ${user.id}, email: ${user.email}]`;
            }
        }
        await connection.run(
            `UPDATE emails
            SET system_message = ?
            WHERE id = ?`,
            [systemMessage, email.id],
        );
        res.send();
    } catch (error) {
        res.status(501).send("Error handling email(s)");
    } finally {
        connection.close();
    }
});

router.delete("/api/email/deleteEmail", async (req, res) => {
    const connection = await createConnection();

    await connection.run(
        `DELETE FROM emails 
        WHERE id = ?`,
        [req.body.id],
    );
    connection.close();

    res.sendStatus(200);
});

/* Module exports */
export default router;
