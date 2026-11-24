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
router.post("/api/contact", async (req, res) => {
    res.status(201);
    const connection = await createConnection();
    let systemMessage = "[system: email]";

    try {
        const emails = await connection.all(
            `INSERT INTO emails ('subject', 'body', 'system_message')
            VALUES (?, ?, ?)
            RETURNING *`,
            [escapeHTML(req.body.title), escapeHTML(req.body.message), ""],
        );
        const email = emails[0];

        for (const id of req.body.userIds) {
            const users = await connection.all(
                `SELECT id, email FROM users
                WHERE id = ?`,
                [id],
            );
            const user = users[0];
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

/* Module exports */
export default router;
