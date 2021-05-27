import express from "express";
import LibraryController from "../controllers/Library.js";

const router = express.Router();

router
    .get("/dashboard", (req, res) => {
        LibraryController.getActiveLibrary(req, res);
    })
    //.get("/read/:bookId", LibraryController.getDocumentChapter)
    //.post("/read/:bookId", LibraryController.updateDocumentChapter);

export default {routes: router};
