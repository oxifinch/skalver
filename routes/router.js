import express from "express";
import LibraryController from "../controllers/Library.js";
import BookController from "../controllers/Book.js";
import ChapterController from "../controllers/Chapter.js";
import UserController from "../controllers/User.js";

const router = express.Router();

function redirectLogin(req, res, next) {
    // TODO: If the user is not authenticated, they should not be able to 
    // go to the dashboard. If an unauthenticated user tries to go to dashboard,
    // send them to login page.
    if(!req.session.userId || !req.session.userName || !req.session) {
        res.redirect("/");
        next();
    } 
}

router
    // TODO: Split these routes into relevant files
    // Main app routes
    .get("/", (req, res) => {
        // TODO: User should be directed to login page if they are not 
        // already signed in, or redirected to dashboard if they are
        res.render("pages/home");
    })
    .get("/dashboard", UserController.loadUserDashboard) 

    // Libraries
    .get("/library", LibraryController.loadLibrary) 
    .post("/library/create", LibraryController.createLibrary)

    // Books/chapters
    .get("/read/:bookId", ChapterController.readChapter)
    .post("/book/create", BookController.createBook)
    .post("/chapter/update/:chapterId", ChapterController.updateChapter)
    .post("/chapter/create/:bookId", ChapterController.createChapter)


    // Authentication/login
    .get("/login", (req, res) => {
        res.redirect("/");
    })
    .post("/login", UserController.loginUser)
    .get("/logout", UserController.logoutUser)
    .get("/register", (req, res) => {
        res.render("pages/register");
    })
    .post("/register", UserController.createUser)

export default {routes: router};
