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

function getChapter(req, res) {
    // TODO: Look up the user's actual active library and use it to query the
    // database instead of hardcoding it here.
    let activeLibraryId = "123";
    let doc = req.params.doc;
    let chapter = 0;
    let documentData = LibraryModel.loadDocumentChapter(activeLibraryId, doc, chapter);
    res.render("reading", {
        doc: documentData
    });
}

export default {getAll, getActiveLibrary, getChapter};
