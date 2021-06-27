import express from "express";
import session from "express-session";
import router from "./routes/router.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

const SESSION_LIFETIME = 1000 * 60 * 60;

dotenv.config();
const {
    PORT,
    DB_CONNECTION_STRING,
    SESSION_NAME,
    SESSION_SECRET,
    NODE_ENV
} = process.env;
const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: true,
        maxAge: SESSION_LIFETIME,
        secure: NODE_ENV === "production"
    }
}));
app.use(router.routes);

// TODO: How to store users/sessions?
mongoose.connect(DB_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => console.log("[ INFO ] Connected to DB."))
.catch((err) => {
    console.log(err);
});


app.listen(PORT, () => {
    console.log(`[ INFO ] Skalver server listening on Port ${PORT}..`);
});
