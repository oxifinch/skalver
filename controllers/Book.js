import Book from "../models/Book.js";
import Library from "../models/Library.js";
import User from "../models/User.js";

async function createBook(req, res) {
    if(!req.session.userName || !req.session.userId) {
        return res.redirect("/");
    }
    const user = await User.findById(req.session.userId);
    if(!user) {
        return res.status(404).render("pages/error", {
            message: "You user account could not be located.",
            status: "404 - Not found."
        });
    }
    const parentLibrary = await Library.findById(user.activeLibrary);
    const {
        title,
        subtitle,
        description,
        author,
        type
    } = req.body;
    Book.create({
        title,
        subtitle,
        description,
        author,
        coauthors: [],
        type,
        tags: [],
        chapters: []
    })
    .then((book) => {
        parentLibrary.books.push(book.id);
        parentLibrary.save()
            .then(() => {
                // TODO: This seems a bit unoptimized? How can I simply reload
                // the page contents without redirecting?
                res.status(200).redirect("/library");
            })
            .catch(() => {
                return res.status(500).render("pages/error", {
                    message: "The library could not be updated with the new book.",
                    status: "500 - Internal server error."
                });
            });
    })
    .catch(() => {
        return res.status(500).render("pages/error", {
            message: "The book could not be created.",
            status: "500 - Internal server error."
        });
    });
}

export default {createBook};
