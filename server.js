import express from "express";
import router from "./routes/router.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const {
    PORT,
    DB_CONNECTION_STRING,
} = process.env;
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(router.routes);
mongoose.connect(DB_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => console.log("Connected to DB."))
    .catch(() => console.log("ERROR: Failed to connect to DB."));


app.listen(PORT, () => {
    console.log(`Skalver server listening on Port ${PORT}..`);
});
