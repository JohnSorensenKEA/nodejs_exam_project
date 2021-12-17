import express from "express";
const app = express();

/* Server port setting */
const PORT = process.env.PORT || 8080;

app.listen(PORT, (error) => {
    console.log("Server is running on", PORT);
});