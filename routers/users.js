import express from "express";
const router = express.Router();

import { createConnection } from "../database/connectSqlite.js";
import encryption from "../util/encryption.js";

/* Endpoints */
router.get("/checkLoggedIn", (req, res) => {
    res.send(req.userAuth);
});

router.post("/loginRequest", async (req, res) => {
    const connection = await createConnection();
    const users = await connection.all(`SELECT * FROM users WHERE username = ?`, [req.body.userDetail.username]);
    connection.close();

    if(users.length === 1){
        const result = await encryption.checkPassword(req.body.userDetail.password, users[0].password);
        
        if(result){
            req.userMap.set(req.session.id, users[0].id);
            res.status(200).send({message: "Login was successful, redirecting", status: 200});
        }else{
            res.status(401).send({message: "Incorrect password", status: 401});
        }

    }else{
        res.status(401).send({message: "Could not find account matching username", status: 401});
    }
});

/*
//Hans: 1111, Bob: 2222, Ib: 3333
router.post("/devCreateUser", async (req, res) => {
    const hashedPassword = await encryption.hashPassword(req.body.userDetail.password);

    const connection = await createConnection();

    connection.run(`INSERT INTO users ('username', 'password', 'email', 'member_number') VALUES (?, ?, ?, ?)`, [req.body.userDetail.username, hashedPassword, req.body.userDetail.email, req.body.userDetail.memberNumber]);
    connection.close();
    res.status(201).send({ message: `Added username '${req.body.userDetail.username}'` });
});*/

router.get("/logout", (req, res) => {
    const result = req.userMap.delete(req.session.id);
    if(result){
        res.status(200).send({message: "Successfully logged out"});
    }else{
        res.status(400).send({message: "Could not find user or not logged in"});
    }
});

router.get("/getUserProfiles", async (req, res) => {
    const connection = await createConnection();
    const users = await connection.all(`SELECT id, username FROM users`);
    connection.close();

    res.send(users);
});

/* Module exports */
export default router;