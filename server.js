import express from "express";
import router from "./routes/router.js";
import dotenv from "dotenv";

dotenv.config();
const {
    PORT,
    DB_CONNECTION_STRING,
    NODE_ENV,
} = process.env;
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(router.routes);

app.listen(PORT, () => {
    console.log(`Skalver server listening on Port ${PORT}..`);
});
