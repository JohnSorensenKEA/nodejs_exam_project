import express from "express";
const router = express.Router();

import escapeHTML from "../util/escapeHTML.js";

/* Nodemailer setup */
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pedersenb313@gmail.com', // Unused email...
        pass: '\`]c+GhyNr\'8uXw3\/' // `]c+GhyNr'8uXw3/
    }
});

const mailOptions = {
    from: 'pedersenb313@gmail.com',
    to: 'pedersenb313@gmail.com',
    subject: '',
    text: ''
};

/* Endpoints */
router.post("/api/contact", (req, res) => {
    //TODO: get users, loop through and send
    mailOptions.subject = `${escapeHTML(req.body.title)}`;

    mailOptions.text = `Name: ${escapeHTML(req.body.message)}
        ${escapeHTML(req.body.message)}

        ${Date()}
    `;

    /*
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });*/

    console.log(req.body);

    res.sendStatus(200);
});

/* Module exports */
export default router;