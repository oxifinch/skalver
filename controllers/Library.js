import Library from "../models/Library.js";
import Section from "../models/Section.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

async function loadActiveLibrary(req, res) {
    if(!req.session.userName || !req.session.userId) {
        res.redirect("/login");
    }
    const user = await User.findById(req.session.userId);
    if(!user) {
        res.status(404).render("pages/error", {
            message: "You user account could not be located.",
            status: "404 - Not found."
        });
    }
    // TODO: Redirect to library creation page
    if(user.libraries.length < 1 || !user.activeLibrary) {
        loadLibraryControlPanel(req, res);
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
        res.status(404).json({message: "Library not found."});
    } else {
        res.status(200).render("index", {
            library: library
        });
    }
}

async function loadLibrary(req, res, next) {
    // TODO: Checking that there is a user logged in should be its own function
    if(!req.session.userName || !req.session.userId) {
        res.redirect("/login");
    }
    const user = await User.findById(req.session.userId);
    if(!user) {
        res.status(404).render("pages/error", {
            message: "You user account could not be located.",
            status: "404 - Not found."
        });
    }
    const libraryQuery = req.params.libraryId;
    const requestedLibrary = user.libraries.find(obj => obj.id === libraryQuery);
    if(!requestedLibrary) {
        res.status(404).render("pages/error", {
            message: "The requested library could not be located.",
            status: "404 - Not found."
        });
    }
    console.log(requestedLibrary);
    //user.activeLibrary = requestedLibrary;
}

async function loadLibraryControlPanel(req, res) {
    if(!req.session.userName || !req.session.userId) {
        res.redirect("/login");
    }
    const user = await User.findById(req.session.userId);
    if(!user) {
        res.status(404).render("pages/error", {
            message: "You user account could not be located.",
            status: "404 - Not found."
        });
    } else {
        res.status(200).render("pages/controlpanel-libraries", {
            user: user 
        });
    }
}

export default {
    loadActiveLibrary, 
    loadLibrary, 
    loadLibraryControlPanel
};
