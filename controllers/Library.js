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
        //sections: []
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
    console.log("[ DEBUG ] libraryId param: " + req.params.libraryId);
    let parentLibrary = await Library.findById(req.params.libraryId)
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
        book.chapters.forEach((chapter) => {
            await Chapter.fi
        })
    }
    let targetId;
    // Looping through the user's library list to double check that the library
    // actually belongs to them.
    for(let i = 0; i < user.libraries.length; i++) {
        const currentItem = user.libraries[i];
        if(currentItem === parentLibrary.id.toString().trim()) {
            targetId = currentItem;
        }
    }
    if(!targetId) {
        return res.status(404).render("pages/error", {
            message: "The library you are trying to delete could not be found on your account",
            status: "404 - Not found."
        });
    }
    res.send("Found the thingy!");
}

export default {
    loadLibrary, 
    createLibrary,
    deleteLibrary
};
