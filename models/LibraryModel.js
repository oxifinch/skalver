import fs from "fs";
import path from "path";

const libraries = JSON.parse(fs.readFileSync(path.resolve("./data/testdb.json")));

// TODO: All of this is just for quick prototyping - need to implement actual
// MongoDB database with mongoose!
function loadLibrary(id) {
    const library = libraries.find(obj => obj.id === id); 
    if(!library) {
        // TODO: Add proper error handling
        return false;
    } else {
        return library;
    }
}

// TODO: This will only be used for the active library, so maybe the user's
// active library should be read from within the function instead of being
// supplied as an argument?
function loadDocumentChapter(libraryId, documentId, chapterIndex) {
    const library = libraries.find(obj => obj.id === libraryId); 
    if(!library) {
        // TODO: Add proper error handling
        console.log("Could not find library");
        return false;
    }

    const parentDocument = library.documents.find(obj => obj.document_id === documentId);
    if (!parentDocument) {
        console.log(`Could not find document with ID '${documentId}'`);
        return false;
    }

    if (chapterIndex > parentDocument.chapters.length) {
        console.log("Chapter out of range");
        return false;
    }
    
    // TODO: This is also the part where the markdown should be parsed and
    // translated into HTML
    const chapter = parentDocument.chapters[chapterIndex];
    return {
        markdown: fs.readFileSync(path.resolve(chapter.path), {
            encoding: "utf-8"
        })
    };
}

export default {loadLibrary, loadDocumentChapter};
