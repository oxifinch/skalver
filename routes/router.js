import express from "express";
import LibraryController from "../controllers/Library.js";
//import BookController from "../controllers/Book.js";
import ChapterController from "../controllers/Chapter.js";
import UserController from "../controllers/User.js";

const router = express.Router();

function redirectLogin(req, res, next) {
    // TODO: If the user is not authenticated, they should not be able to 
    // go to the dashboard. If an unauthenticated user tries to go to dashboard,
    // send them to login page.
}

function redirectDashboard(req, res, next) {
    // TODO: If the user is logged in and tries to go to login or register
    // page, they should be redirected to dashboard. If they want to go to
    // login or register, they need to log out first
}

router
    // TODO: Split these routes into relevant files
    .get("/", (req, res) => {
        // TODO: User should be directed to login page if they are not 
        // already signed in, or redirected to dashboard if they are
        res.render("pages/homepage");
    })
    // Main app routes
    .get("/dashboard", LibraryController.loadActiveLibrary)
    .get("/library/:libraryId", LibraryController.loadLibrary)
    .get("/controlpanel/libraries", LibraryController.loadLibraryControlPanel)
    .get("/read/:bookId", ChapterController.readChapter)
    .post("/chapter/update/:chapterId", ChapterController.updateChapter)
    .post("/chapter/create/:bookId", ChapterController.createChapter)
    .post("/library/create", ChapterController.createChapter)


    // Authentication/login
    .get("/login", (req, res) => {
        res.render("pages/login"); 
    })
    .post("/login", UserController.loginUser)
    .get("/register", (req, res) => {
        res.render("pages/register");
    })
    .post("/register", UserController.createUser)

export default {routes: router};
