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
    //TODO: Insert email in db
    //TODO: get users, loop through and send
    mailOptions.subject = `${escapeHTML(req.body.title)}`;

    mailOptions.text = `Name: test
        ${escapeHTML(req.body.message)}

        ${Date()}
    `;
    res.status(201);

    let systemMessage = "";
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(503);
            //TODO: Add error line
        } else {
            //TODO: Add success line
            //TODO: Add user email relation to db
            //console.log("Email sent: " + info.response);
        }
    });

    res.send();
});

/* Module exports */
export default router;
