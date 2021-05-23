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
        chapter = parentDocument.chapters[0];    
    }
    
    // TODO: This is also the part where the markdown should be parsed and
    // translated into HTML
    let markdownPath = path.resolve(chapter.path);
    let markdownData = fs.readFileSync(markdownPath, {encoding: "utf-8"});
    // TODO: I need to figure out how to save the output instead of writing an
    // actual HTML file. Seems a bit excessive and unoptimized. This solution is
    // super janky and fixing it should be a priority.
    let chapterFolder = path.dirname(path.resolve(chapter.path));
    let outputPath = `${chapterFolder}/output.html`;
    execSync(`./mdparser ${markdownPath} ${outputPath}`);
    let htmlOutput = fs.readFileSync(outputPath, {encoding: "utf-8"});
    // TODO: There are also a lot of synchronous functions being used here, on
    // top of a lot of reading/writing. This may be a performance issue.
    return {
        markdown: markdownData,
        output: htmlOutput
    };
}

export default {loadLibrary, loadDocument};
