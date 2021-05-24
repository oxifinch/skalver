import express from "express";
import LibraryController from "../controllers/LibraryController.js";

const router = express.Router();

router
    .get("/dashboard", (req, res) => {
        LibraryController.getActiveLibrary(req, res);
    })
    .get("/document/:doc", LibraryController.getDocument)
    .post("/document/:doc", LibraryController.updateDocumentChapter);

export default {routes: router};
