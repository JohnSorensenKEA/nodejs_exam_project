import "dotenv/config";

import express from "express";
const router = express.Router();

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

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "",
    text: "",
};

/* Endpoints */
router.post("/api/contact", (req, res) => {
    //TODO: get users, loop through and send
    mailOptions.subject = `${escapeHTML(req.body.title)}`;

    mailOptions.text = `Name: test
        ${escapeHTML(req.body.message)}

        ${Date()}
    `;

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });

    res.sendStatus(200);
});

/* Module exports */
export default router;
