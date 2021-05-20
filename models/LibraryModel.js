import fs from "fs";
import path from "path";

const libraries = JSON.parse(fs.readFileSync(path.resolve("./data/testdb.json")));

// TODO: All of this is just for quick prototyping - need to implement actual
// MongoDB database with mongoose!
function loadAll() {
    return libraries;
}

function loadDocument(libId, docId) {
    const library = libraries.find(lib => lib.id === libId);
    if (!library) {
        return {message: `No library found with id ${libId}`};
    }
    const doc = library.documents.find(id => id === docId);
    if (!doc) {
        return {message: `No document with id ${docId} found in '${library.library_name}'`};
    }

    const docFile = fs.readFileSync(path.resolve(`./data/${docId}/${docId}_index.md`), {
        encoding: "utf-8"
    });
    return docFile;
}

function loadChapter(libId, docId, chapter) {
    const library = libraries.find(lib => lib.id === libId);
    if (!library) {
        return {message: `No library found with id ${libId}`};
    }
    const doc = library.documents.find(id => id === docId);
    if (!doc) {
        return {message: `No document with id ${docId} found in '${library.library_name}'`};
    }

    const chapterFile = fs.readFileSync(path.resolve(`./data/${docId}/${docId}_${chapter}.md`), {
        encoding: "utf-8"
    });
    return chapterFile;
}

export default {loadAll, loadDocument, loadChapter};
