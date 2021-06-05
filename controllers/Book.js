import Book from "../models/Book.js";
import Chapter from "../models/Chapter.js";
import Library from "../models/Library.js";
import User from "../models/User.js";

async function createBook(req, res) {
    // TODO: Implement validation function
    if(!req.session.userName || !req.session.userId) {
        return res.redirect("/");
    }
    const user = await User.findById(req.session.userId);
    if(!user) {
        return res.status(404).render("pages/error", {
            message: "Your user account could not be located.",
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

async function deleteBook(req, res) {
    // TODO: Implement validation function
    if(!req.session.userName || !req.session.userId) {
        return res.redirect("/");
    }
    const user = await User.findById(req.session.userId);
    if(!user) {
        return res.status(404).render("pages/error", {
            message: "Your user account could not be located.",
            status: "404 - Not found."
        });
    }
    const parentLibrary = await Library.findById(user.activeLibrary);
    if(!parentLibrary) {
        return res.status(404).render("pages/error", {
            message: "Your active library could not be located.",
            status: "404 - Not found."
        });
    }
    let targetId;
    for(let i = 0; i < parentLibrary.books.length; i++) {
        const currentItem = parentLibrary.books[i].toString().trim();
        if(currentItem === req.params.bookId.toString().trim()) {
            targetId = parentLibrary.books[i];
        }
    }
    if(!targetId) {
        return res.status(404).render("pages/error", {
            message: "The book you are trying to delete could not be found in the library.",
            status: "404 - Not found."
        });
    }
    const parentBook = await Book.findById(targetId);
    if(!parentBook) {
        return res.status(404).render("pages/error", {
            message: "The book you are trying to delete could not be located.",
            status: "404 - Not found."
        });
    }
    // TODO: There is probably a smoother way to do this using MongoDB queries.
    for(let i = 0; i < parentBook.chapters.length; i++) {
        await Chapter.findByIdAndDelete(parentBook.chapters[i]);
    }
    // TODO: User should be prompted for confirmation before they are allowed to
    // delete anything.
    Book.findByIdAndDelete(targetId)
        .then((result) => {
            console.log("[ DEBUG ] Deleted book: ");
            console.log(result);
            parentLibrary.books.pull(targetId);
            parentLibrary.save()
                .then((result) => {
                    console.log("[ DEBUG ] Pulled book from library. Result: ");
                    console.log(result);
                })
                .catch((err) => {
                    console.log("[ DEBUG ] Failed to pull book. Error: ");
                    console.log(err);
                });

        })
        .catch((err) => {
            console.log("[ DEBUG ] Book failed to delete. Error: ");
            console.log(err);
            return res.status(500).render("pages/error", {
                message: "The book could not be deleted.",
                status: "500 - Internal server error."
            });
        });
}

async function editBook(req, res) {
    // TODO: Implement validation function
    if(!req.session.userName || !req.session.userId) {
        return res.redirect("/");
    }
    const user = await User.findById(req.session.userId);
    if(!user) {
        return res.status(404).render("pages/error", {
            message: "Your user account could not be located.",
            status: "404 - Not found."
        });
    }
    // ---------------------------------
    // TODO: This whole section could be condensed. Library, user ownership and
    // that the book exists in the library SHOULD be confirmed before changing
    // anything, but this is overly verbose and error prone.
    const parentLibrary = await Library.findById(user.activeLibrary);
    if(!parentLibrary) {
        return res.status(404).render("pages/error", {
            message: "Your active library could not be located.",
            status: "404 - Not found."
        });
    }
    let targetId;
    for(let i = 0; i < parentLibrary.books.length; i++) {
        const currentItem = parentLibrary.books[i].toString().trim();
        if(currentItem === req.params.bookId.toString().trim()) {
            targetId = parentLibrary.books[i];
        }
    }
    if(!targetId) {
        return res.status(404).render("pages/error", {
            message: "The book you are trying to edit could not be found in the library.",
            status: "404 - Not found."
        });
    }
    const parentBook = await Book.findById(targetId);
    if(!parentBook) {
        return res.status(404).render("pages/error", {
            message: "The book you are trying to edit could not be located.",
            status: "404 - Not found."
        });
    }
    console.log(" [ DEBUG ] Editing book: ");
    console.log(parentBook);
    // ---------------------------------
    let {
        newTitle,
        newSubtitle,
        newDescription,
        newAuthor, 
        newBookType,
        newCoauthors
    } = req.body;
    if(!newTitle) {
        newTitle = parentBook.title;
    }
    if(!newSubtitle) {
        newSubtitle = parentBook.subtitle;
    }
    if(!newDescription) {
        newDescription = parentBook.description;
    }
    if(!newAuthor) {
        newAuthor = parentBook.author;
    }
    if(!newBookType) {
        newBookType = parentBook.bookType;
    }
    if(!newCoauthors) {
        newCoauthors = parentBook.coauthors;
    }
    parentBook.title = newTitle;
    parentBook.subtitle = newSubtitle;
    parentBook.description = newDescription;
    parentBook.author = newAuthor;
    parentBook.bookType = newBookType;
    parentBook.coauthors = newCoauthors;
    console.log(" [ DEBUG ] Book after changes: ");
    console.log(parentBook);
    parentBook.save()
        .then(() => {
            res.status(200).redirect(`/read/${parentBook.id}`);
        })
        .catch((err) => {
            console.log("[ DEBUG ] Error when updating book info: ");
            console.log(err);
            res.status(500).render("pages/error", {
                message: "The book information could not be updated.",
                status: "500 - Internal server error."
            });
        })
}

export default {createBook, deleteBook, editBook};
