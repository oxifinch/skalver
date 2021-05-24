import fs from "fs";
import path from "path";
import {execSync} from "child_process";

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
function loadDocument(libraryId, documentId, chapterIndex) {
    const library = libraries.find(obj => obj.id === libraryId); 
    if(!library) {
        // TODO: Add proper error handling
        console.log("Could not find library");
        return false;
    }

    let parentDocument = library.documents.find(obj => obj.document_id === documentId);
    if (!parentDocument) {
        console.log(`Could not find document with ID '${documentId}'`);
        return false;
    }

    let chapter = parentDocument.chapters[chapterIndex];
    if (chapterIndex > parentDocument.chapters.length || !parentDocument.chapters[chapterIndex]) {
        chapterIndex = 0;
        chapter = parentDocument.chapters[chapterIndex];    
    }
    // TODO: Is this the optimal way to get the next/previous document?
    let nextChapterURL = `/document/${parentDocument.document_id}?chapter=${parseInt(chapterIndex)+1}`;
    let prevChapterURL = `/document/${parentDocument.document_id}?chapter=${parseInt(chapterIndex)-1}`;
    
    let markdownPath = path.resolve(chapter.path);
    let markdownData = fs.readFileSync(markdownPath, {encoding: "utf-8"});
    let htlmString = execSync(`./mdparser ${markdownPath}`, {encoding: "utf-8"});
    let htmlOutput = htlmString;
    // TODO: There are also a lot of synchronous functions being used here, on
    // top of a lot of reading/writing. This may be a performance issue.
    return {
        title: parentDocument.title,
        markdown: markdownData,
        output: htmlOutput,
        next: nextChapterURL,
        previous: prevChapterURL,
    };
}

async function editDocumentChapter(libraryId, documentId, chapterIndex, textContent) {
    let library = libraries.find(obj => obj.id === libraryId);
    let parentDocument = library.documents.find(obj => obj.document_id === documentId);
    let chapter = parentDocument.chapters[chapterIndex];
    if(!chapter) {
        return false;
    }
    fs.writeFileSync(path.resolve(chapter.path), textContent.toString(), {encoding: "utf-8"});
}

export default {loadLibrary, loadDocument, editDocumentChapter};
