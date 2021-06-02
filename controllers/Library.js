import Library from "../models/Library.js";
import User from "../models/User.js";
import Book from "../models/Book.js";
import Section from "../models/Section.js";

// TODO: Change this function so that it only reads from the active library of
// the user and redirects there
async function loadActiveLibrary(req, res) {
    if(!req.session.userName || !req.session.userId) {
        res.redirect("/");
    }
    const user = await User.findById(req.session.userId);
    if(!user) {
        res.status(404).render("pages/error", {
            message: "You user account could not be located.",
            status: "404 - Not found."
        });
    }
    if(user.libraries.length < 1 || !user.activeLibrary) {
        res.status(404).redirect("/dashboard");
    }
    let library = await Library.findById(user.activeLibrary)
        .populate({
            path: "sections",
            populate: {
                path: "books",
                select: {title: 1}
            }
        })
        .populate({
            path: "books",
            select: {
                title: true,
                author: true,
                series: true,
                tags: true
            }
        })
        .exec();
    if (!library) {
        return res.status(404).render("pages/error", {
            message: "Sorry, the library could not be located.",
            status: "404 - Not found."
        });
    } else {
        return res.status(200).render("pages/library", {
            library: library
        });
    }
}

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
            path: "sections",
            populate: {
                path: "books",
                select: {title: 1}
            }
        })
        .populate({
            path: "books",
            select: {
                title: true,
                author: true,
                series: true,
                tags: true
            }
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
        res.redirect("/");
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
        sections: []
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

export default {
    loadActiveLibrary, 
    loadLibrary, 
    createLibrary
};
