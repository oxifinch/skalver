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

function getDocument(req, res) {
    // TODO: Look up the user's actual active library and use it to query the
    // database instead of hardcoding it here.
    let activeLibraryId = "123";
    let doc = req.params.doc;
    let chapter = req.query.chapter;
    let documentData = LibraryModel.loadDocument(activeLibraryId, doc, chapter);
    res.render("reading", {
        doc: documentData,
    });
}

async function updateDocumentChapter(req, res) {
    // Save the document and reload
    let documentId = req.params.doc;
    let chapter = req.query.chapter;
    await LibraryModel.editDocumentChapter("123", documentId, chapter, req.body.textContent);
    res.json({message: "Chapter updated!"});
}

export default {getAll, getActiveLibrary, getDocument, updateDocumentChapter};
