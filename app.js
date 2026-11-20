/* #Setting Express */
import express from "express";
const app = express();

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import cors from "cors";
app.use(
    cors({
        origin: ["http://localhost:8080"],
    }),
);

import helmet from "helmet";
app.use(helmet());

import session from "express-session";
app.use(
    session({
        secret: "Blobfish are great",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    }),
);

import rateLimit from "express-rate-limit";
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
});
app.use(rateLimiter);

const loggedInUserMap = new Map();

const sessionToUserId = async (req, res, next) => {
    req.userMap = loggedInUserMap;
    req.userAuth = loggedInUserMap.has(req.session.id);
    next();
};
app.use(sessionToUserId);

/* Socket handling */
import http from "http";
const server = http.createServer(app);
server.listen(process.env.PORT || 8080); //Specify http server port

import { Server } from "socket.io";
const io = new Server(server);

import { createConnection } from "./database/connectSqlite.js";

//io.use()

io.on("connection", (socket) => {
    socket.on("chat message", async (message) => {
        /*
        const sessionSocketId = await new Promise((resolve, reject) =>
            session(
                {
                    secret: "Blobfish are great",
                    saveUninitialized: true,
                    cookie: { secure: false },
                    headers: socket.handshake.headers,
                },
                resolve,
            ),
        );

        console.log(sessionSocketId);
        */
        const connection = await createConnection();

        //console.log("socket session id: " + message.sessionId);
        //console.log(loggedInUserMap.get(message.sessionId));

        const insertedMessage = await connection.all(
            `INSERT INTO messages ('text', 'user_id') VALUES (?, ?)
            RETURNING *`,
            [escapeHTML(message.message.toString()), 1], //loggedInUserMap.get(message.sessionId)],
        );
        const newMessage = await connection.all(
            `SELECT m.text, m.created_at, u.username
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.id = ?`,
            [insertedMessage[0].id],
        );
        connection.close();

        io.emit("new message", {
            message: newMessage[0].text,
            username: newMessage[0].username,
            created_at: newMessage[0].created_at,
        });
    });
});

/* Page render function */
import createPage from "./render.js";

/* Utility import and use */
import escapeHTML from "./util/escapeHTML.js";

/* Router import and use */
import chatRouter from "./routers/chat.js";
import pinboardRouter from "./routers/pinboard.js";
import usersRouter from "./routers/users.js";
import emailRouter from "./routers/email.js";

app.use(chatRouter);
app.use(pinboardRouter);
app.use(usersRouter);
app.use(emailRouter);

/* Ready the pages */
const frontpagePage = createPage("front/frontpage.html", {
    title: "Community | Welcome",
    scriptTag: `<script></script>`,
});

const chatPage = createPage("chat/chatpage.html", {
    title: "Community | Chat",
    scriptTag: `<script src="../pages/chat/chatpage.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script>
        var socket = io();
    </script>`,
});

const pinboardPage = createPage("pinboard/pinboardpage.html", {
    title: "Community | Pinboard",
    scriptTag: `<script src="../pages/pinboard/pinboardpage.js"></script>`,
});

const loginPage = createPage("login/loginpage.html", {
    title: "Community | Login",
    scriptTag: `<script src="../pages/login/loginpage.js"></script>`,
});

const emailPage = createPage("email/emailpage.html", {
    title: "Community | Email",
    scriptTag: `<script src="../pages/email/emailpage.js"></script>`,
});

const fileManagerPage = createPage("files_manager/filesmanagerpage.html", {
    title: "Community | Files",
    scriptTag: `<script src="../pages/files_manager/filesmanagerpage.js"></script>`,
})

const requestsPage = createPage("requests/requestspage.html", {
    title: "Community | Files",
    scriptTag: `<script src="../pages/requests/requestspage.js"></script>`,
})

/* Site endpoints */
app.get("/", (req, res) => {
    res.send(frontpagePage);
});

app.get("/chat", (req, res) => {
    if (!req.userAuth) {
        res.redirect("/login");
    } else {
        res.send(chatPage);
    }
});

app.get("/pinboard", (req, res) => {
    if (!req.userAuth) {
        res.redirect("/login");
    } else {
        res.send(pinboardPage);
    }
});

app.get("/login", (req, res) => {
    if (req.userAuth) {
        res.redirect("/pinboard");
    } else {
        res.send(loginPage);
    }
});

app.get("/email", (req, res) => {
    if (!req.userAuth) {
        res.redirect("/login");
    } else {
        res.send(emailPage);
    }
});

app.get("/files", (req, res) => {
    if (!req.userAuth) {
        res.redirect("/login");
    } else {
        res.send(fileManagerPage);
    }
});

app.get("/requests", (req, res) => {
    if (!req.userAuth) {
        res.redirect("/login");
    } else {
        res.send(requestsPage);
    }
});

/* Server port setting */
const PORT = process.env.PORT || 8080;

app.listen(PORT, (error) => {
    console.log("Server is running on", PORT);
});
