import Library from "../models/Library.js";
import User from "../models/User.js";
import Book from "../models/Book.js";
import Chapter from "../models/Chapter.js";
//import Section from "../models/Section.js";

async function loadLibrary(req, res) {
    if(!req.session.userName || !req.session.userId) {
        res.redirect("/");
    }
    const user = await User.findById(req.session.userId)
        .populate({
            path: "libraries"
        })
        .exec();
    if(!user) {
        res.status(404).render("pages/error", {
            message: "You user account could not be located.",
            status: "404 - Not found."
        });
    }
    let libraryQuery = req.query.libraryId;
    if(!libraryQuery) {
        if(!user.activeLibrary) {
            libraryQuery = user.libraries[0].id.toString().trim();
        } else {
            libraryQuery = user.activeLibrary.toString().trim();
        }
    }
    const requestedLibrary = await user.libraries.find(obj => obj.id === libraryQuery);
    if(!requestedLibrary) {
        console.log("Didn't find anything!");
        res.status(404).render("pages/error", {
            message: "The requested library could not be located.",
            status: "404 - Not found."
        });
    }
    user.activeLibrary = requestedLibrary;
    let libraryData = await Library.findById(user.activeLibrary)
        .populate({
            path: "books",
            select: [
                "title",
                "author",
                "series",
                "tags",
            ]
        })
        .exec();
    user.save()
        .then(() => {
            res.status(200).render("pages/library", {
                user: user,
                library: libraryData
            });
        })
        .catch(() => {
            res.status(500).redirect("/dashboard", {
                message: "Sorry, the library could not be opened at this time."
            });
        });
}

async function createLibrary(req, res) {
    if(!req.session.userName || !req.session.userId) {
        return res.redirect("/");
    }
    const user = await User.findById(req.session.userId);
    if(!user) {
        res.status(404).render("pages/error", {
            message: "You user account could not be located.",
            status: "404 - Not found."
        });
    }
    let {name, description} = req.body;
    if(!name) {
        name = "Unnamed";
    }
    if(!description) {
        description = "";
    }
    Library.create({
        name: name,
        description: description,
        books: [],
        wallpaper: "",
    })
    .then((result) => {
        user.activeLibrary = result.id;
        user.libraries.push(result.id);
        user.save()
        .then(() => {
            res.redirect("/dashboard");
        })
        .catch(() => {
            res.status(500).render("pages/error", {
                message: "Your active library could not be updated on your account.",
                status: "500 - Internal server error."
            });
        })
    })
    .catch(() => {
        res.status(500).render("pages/error", {
            message: "The library could be be created at this time.",
            status: "500 - Internal server error."
        });
    });
}

async function editLibrary(req, res) {
    if(!req.session.userName || !req.session.userId) {
        res.redirect("/");
    }
    const user = await User.findById(req.session.userId);
    if(!user) {
        return res.status(404).render("pages/error", {
            message: "Your user account could not be located.",
            status: "404 - Not found."
        });
    }
    // Looping through the user's library list to double check that the library
    // actually belongs to them. targetId should only be set if a match is found.
    const libraryQuery = req.params.libraryId;
    let targetId;
    for(let i = 0; i < user.libraries.length; i++) {
        const currentItem = user.libraries[i];
        if(currentItem.toString().trim() === libraryQuery.toString().trim()) {
            targetId = currentItem;
        }
    }
    if(!targetId) {
        return res.status(404).render("pages/error", {
            message: "The library you are trying to delete could not be found on your account",
            status: "404 - Not found."
        });
    }
    let targetLibrary = await Library.findById(targetId);
    if(!targetLibrary) {
        return res.status(404).render("pages/error", {
            message: "Sorry, the library could not be located.",
            status: "404 - Not found."
        });
    }
    let {
        name,
        description,
        wallpaper
    } = req.body;
    if(name && name.trim() != "") {
        targetLibrary.name = name.toString();
    }
    if(description) {
        targetLibrary.description = description.toString();
    }
    if(wallpaper.length < 1000) {
        targetLibrary.wallpaper = wallpaper.toString();
    }
    targetLibrary.save()
        .then((result) => {
            console.log("Saved library: " + result);
            return res.status(200).redirect("/library");
        })
        .catch((err) => {
            console.log("Failed to save library: " + err);
            return res.status(500).render("pages/error", {
                message: "Your changes to the library could not be saved at this time.",
                status: "500 - Internal server error."
            });
        });
}

async function deleteLibrary(req, res) {
    if(!req.session.userName || !req.session.userId) {
        res.redirect("/");
    }
    const user = await User.findById(req.session.userId);
    if(!user) {
        return res.status(404).render("pages/error", {
            message: "Your user account could not be located.",
            status: "404 - Not found."
        });
    }
    // Looping through the user's library list to double check that the library
    // actually belongs to them. targetId should only be set if a match is found.
    const libraryQuery = req.params.libraryId;
    let targetId;
    for(let i = 0; i < user.libraries.length; i++) {
        const currentItem = user.libraries[i];
        if(currentItem.toString().trim() === libraryQuery.toString().trim()) {
            targetId = currentItem;
        }
    }
    if(!targetId) {
        return res.status(404).render("pages/error", {
            message: "The library you are trying to delete could not be found on your account",
            status: "404 - Not found."
        });
    }
    let parentLibrary = await Library.findById(targetId)
        .populate({
            path: "books",
            select: [
                "_id" 
            ]
        })
        .exec();
    if(!parentLibrary) {
        return res.status(404).render("pages/error", {
            message: "The library you are trying to delete could not be located.",
            status: "404 - Not found."
        });
    }
    for(let i = 0; i < parentLibrary.books.length; i++) {
        const book = await Book.findById(parentLibrary.books[i]);
        for(let j = 0; j < book.chapters.length; j++) {
            // TODO: Not sure how errors should be handled here. Should the
            // deletion process be aborted? 
            Chapter.findByIdAndDelete(book.chapters[j])
                .catch((err) => {
                    console.log("[ DEBUG ] Failed to delete chapter. Error: ");
                    console.log(err);
                });
        }
        Book.findByIdAndDelete(parentLibrary.books[i])
            .catch((err) => {
                console.log("[ DEBUG ] Failed to delete book. Error: ");
                console.log(err);
            });
    }
    user.libraries.pull(parentLibrary.id);
    user.save()
        .then(() => {
            Library.findByIdAndDelete(targetId)
                .then(() => {
                    return res.status(200).redirect("/dashboard");
                })
                .catch((err) => {
                    console.log("[ DEBUG ] Failed to delete library. Error: ");
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log("[ DEBUG ] Failed to save changes to user: ");
            console.log(err);
        });
}

export default {
    loadLibrary, 
    createLibrary,
    editLibrary,
    deleteLibrary
};
