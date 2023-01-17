/* #Setting Express */
import express from "express";
const app = express();

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import helmet from "helmet";
app.use(helmet());

import session from "express-session";
app.use(session({
    secret: 'Blobfish are great',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

import rateLimit from "express-rate-limit";
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
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

import { Server } from "socket.io";
const io = new Server(server);

import { createConnection } from "/Users/John/Google Drev/Datamatiker/NodeJS_fag/node_git/nodejs_exam_project/database/connectSqlite.js";

io.on("connection",  (socket) => {
    socket.on("chat message", async (message) => {

        const connection = await createConnection();
        await connection.run(`INSERT INTO messages ('text', 'user_id') VALUES (?, ?)`, [message.message, message.id]);
        connection.close();

        io.emit("new message", {message: escapeHTML(message.message), id: escapeHTML(message.id)});
    });
});

/* Page render function */
import createPage from "./render.js";

/* Router import and use */
import chatRouter from "./routers/chat.js";
import pinboardRouter from "./routers/pinboard.js";
import usersRouter from "./routers/users.js";
import emailRouter from "./routers/email.js";
import escapeHTML from "./util/escapeHTML.js";

app.use(chatRouter);
app.use(pinboardRouter);
app.use(usersRouter);
app.use(emailRouter);

/* Ready the pages */
const frontpagePage = createPage("front/frontpage.html", { 
    title: "Community | Welcome",
    scriptTag: `<script></script>`
});

const chatPage = createPage("chat/chatpage.html", { 
    title: "Community | Chat",
    scriptTag: `<script src="../pages/chat/chatpage.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script>
        var socket = io();
    </script>`
});

const pinboardPage = createPage("pinboard/pinboardpage.html", { 
    title: "Community | Pinboard",
    scriptTag: `<script src="../pages/pinboard/pinboardpage.js"></script>`
});

const loginPage = createPage("login/loginpage.html", { 
    title: "Community | Login",
    scriptTag: `<script src="../pages/login/loginpage.js"></script>`
});

const emailPage = createPage("email/emailpage.html", {
    title: "Community | Email",
    scriptTag: `<script src="../pages/email/emailpage.js"></script>`
});

/* Site endpoints */
app.get("/", (req, res) => {
    res.send(frontpagePage);
});

app.get("/chat", (req, res) => {
    if(!req.userAuth) {
        res.redirect("/login");
    }
    res.send(chatPage);
});

app.get("/pinboard", (req, res) => {
    if(!req.userAuth) {
        res.redirect("/login");
    }
    res.send(pinboardPage);
});

app.get("/login", (req, res) => {
    if(req.userAuth) {
        res.redirect("/pinboard");
    }
    res.send(loginPage);
});

app.get("/email", (req, res) => {
    if(!req.userAuth) {
        res.redirect("/login");
    }
    res.send(emailPage);
});

/* Server port setting */
const PORT = process.env.PORT || 8080;

app.listen(PORT, (error) => {
    console.log("Server is running on", PORT);
});