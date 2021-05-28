import express from "express";
import LibraryController from "../controllers/Library.js";
//import BookController from "../controllers/Book.js";
import ChapterController from "../controllers/Chapter.js";

const router = express.Router();

router
    .get("/dashboard", LibraryController.getActiveLibrary)
    .get("/read/:bookId", ChapterController.getChapter);
    //.get("/read/:bookId", BookController.getBookInfo);

export default {routes: router};
