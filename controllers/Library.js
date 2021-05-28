import Library from "../models/Library.js";
import Section from "../models/Section.js";
import Book from "../models/Book.js";

// Fetch and display the user's active library 
async function getActiveLibrary(_req, res) {
    // TODO: Look up the user's actual active library and use it to query the
    // database instead of hardcoding it here.
    let searchTerm = "Skalver Test Library";
    let library = await Library.findOne({name: searchTerm})
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

async function updateDocumentChapter(req, res) {
    // Save the document and reload
    let documentId = req.params.doc;
    let chapter = req.query.chapter;
    try {
        await Library.editDocumentChapter("123", documentId, chapter, req.body.textContent);
        try {
            res.status(201).json({message: "Document successfully updated!"});
        } catch {
            res.status(404).render("pages/error", {
                message: "There was an error reloading the document. Please try again.",
                status: "404 - Resource not found."
            });
        }
    } catch {
        res.status(404).render("pages/error", {
            message: "Sorry, there was an error saving your changes.",
            status: "404 - Could not save resource."
        });
    }
}

export default {getActiveLibrary, updateDocumentChapter};
