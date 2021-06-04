import Book from "../models/Book.js";
import Chapter from "../models/Chapter.js";
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
    let {
        title,
        subtitle,
        description,
        author,
        bookType,
    } = req.body;
    // TODO: This is a really roundabout way of handling undefined values. I
    // should find a more concise way of writing this so that it's easier to
    // maintain and read. Undefined values should not be passed to the book on
    // creation, and the book should use schema-defined defaults instead.
    if(!subtitle) {
        subtitle = "";
    } 
    if(!description) {
        description = "";
    }
    if(!author) {
        author = "Unknown Author";
    }
    if(!bookType) {
        bookType = "";
    }
    Chapter.create({
        name: `${title}: Index`,
        markdown: `# ${title}: Index`,
        tags: []
    })
    .then((chapter) => {
        Book.create({
            title,
            subtitle,
            description,
            author,
            coauthors: [],
            bookType,
            tags: [],
            chapters: [chapter]
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
        .catch((err) => {
            console.log(err);
            return res.status(500).render("pages/error", {
                message: "The book could not be created.",
                status: "500 - Internal server error."
            });
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).render("pages/error", {
            message: "The book could not be created.",
            status: "500 - Internal server error."
        });
    })
}

export default {createBook};
