import LibraryModel from "../models/LibraryModel.js";

function getAll(_req, res) {
    res.status(200).json(LibraryModel.loadAll()); 
}

// Fetch and display the user's active library 
function getActiveLibrary(_req, res) {
    // TODO: Look up the user's actual active library and use it to query the
    // database instead of hardcoding it here.
    let activeLibraryId = "123";
    let library = LibraryModel.loadLibrary(activeLibraryId);
    if (!library) {
        res.status(404).json({message: "Library not found."});
    } else {
        res.render("index", {
            libraryName: library.library_name,
            sections: library.sections,
            documents: library.documents,
        });
    }
}

function getDocumentChapter(req, res) {
    // TODO: Look up the user's actual active library and use it to query the
    // database instead of hardcoding it here.
    let activeLibraryId = "123";
    let docQuery = req.params.doc;
    let chapterQuery = req.query.chapter;
    try {
        let documentData = LibraryModel.loadDocumentChapter(activeLibraryId, docQuery, chapterQuery);
        res.status(200).render("reading", {
            doc: documentData,
        });
    } catch {
        res.status(404).render("pages/error", {
            message: "Sorry, the resource you requested could not be located.",
            status: "404 - Resource not found."
        });
    }
}

async function updateDocumentChapter(req, res) {
    // Save the document and reload
    let documentId = req.params.doc;
    let chapter = req.query.chapter;
    try {
        await LibraryModel.editDocumentChapter("123", documentId, chapter, req.body.textContent);
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

export default {getAll, getActiveLibrary, getDocumentChapter, updateDocumentChapter};
