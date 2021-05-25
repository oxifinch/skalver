import express from "express";
import router from "./routes/router.js";

const app = express();
// TODO: Use .env instead?
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(router.routes);

app.listen(PORT, () => {
    console.log(`Skalver server listening on Port ${PORT}..`);
});
