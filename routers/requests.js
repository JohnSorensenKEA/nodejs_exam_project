import express from "express";

const router = express.Router();

import escapeHTML from "../util/escapeHTML.js";

import connectMongoDB from "../database/connectMongoDB.js";

const db = connectMongoDB.requestsCollection;

router.get("/api/requests/getRequests", async (req, res) => {
    const requests = await db.find().toArray();

    res.send(requests);
});

router.post("/api/requests/newRequest", async (req, res) => {
    try {
        await db.insertOne({
            email: escapeHTML(req.body.email),
            title: escapeHTML(req.body.subject),
            message: escapeHTML(req.body.message),
            createdAt: new Date(),
        });
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.delete("/api/requests/deleteRequest", async (req, res) => {
    try {
        await db.deleteOne({ _id: new connectMongoDB.ObjectId(req.body.id) });
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

export default router;
