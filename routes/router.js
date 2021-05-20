import express from "express";
import LibraryController from "../controllers/LibraryController.js";

const router = express.Router();

router
    .get("/", (req, res) => {
        res.status(200).json({message: "Here's the root of the server!"});
    })
    .get("/libraries", LibraryController.getAll);

export default {routes: router};
