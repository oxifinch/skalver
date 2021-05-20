import express from "express";
import LibraryController from "../controllers/LibraryController.js";

const router = express.Router();

router
    .get("/", LibraryController.getAll)
    // TODO: How to implement proper routing for handling different queries? Do
    // I need different routes for when the user wants the index, or only a specific
    // chapter?
    .get("/libraries/", LibraryController.getChapter);

export default {routes: router};
