import express from "express";
import LibraryController from "../controllers/Library.js";

const router = express.Router();

router
    .get("/dashboard", (req, res) => {
        LibraryController.getActiveLibrary(req, res);
    })
    .get("/document/:doc", LibraryController.getDocumentChapter)
    .post("/document/:doc", LibraryController.updateDocumentChapter);

export default {routes: router};
