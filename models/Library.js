import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 2,
        maxLength: 40,
        required: true
    },
    description: {
        type: String,
        maxLength: 5000,
        required: true
    },
    sections: [
        {type: mongoose.Types.ObjectId, ref: "section"}
    ],
    books: [
        {type: mongoose.Types.ObjectId, ref: "book"}
    ]
});

export default mongoose.model("library", librarySchema);

//async function loadLibrary(_id) {
//    // TODO: Look among the user's libraries, or the libraries they have access
//    // to. By default, the user's active library should be loaded.
//    //const library = libraries.find(obj => obj.id === id); 
//    const library = await Library.findOne({name: "Skalver Test Library"}).exec();
//    if(!library) {
//        throw "Requested library could not be found.";
//    } else {
//        return library;
//    }
//}
//
//// TODO: This will only be used for the active library, so maybe the user's
//// active library should be read from within the function instead of being
//// supplied as an argument?
//function loadDocumentChapter(libraryId, documentId, chapterIndex) {
//    const library = libraries.find(obj => obj.id === libraryId); 
//    if(!library) {
//        throw "Requested library could not be found.";
//    }
//
//    let parentDocument = library.documents.find(obj => obj.document_id === documentId);
//    if (!parentDocument) {
//        throw "Requested document could not be found.";
//    }
//
//    let chapter = parentDocument.chapters[chapterIndex];
//    if (chapterIndex > parentDocument.chapters.length || !parentDocument.chapters[chapterIndex]) {
//        chapterIndex = 0;
//        chapter = parentDocument.chapters[chapterIndex];    
//    }
//    // TODO: Is this the optimal way to get the next/previous document?
//    let nextChapterURL = `/document/${parentDocument.document_id}?chapter=${parseInt(chapterIndex)+1}`;
//    let prevChapterURL = `/document/${parentDocument.document_id}?chapter=${parseInt(chapterIndex)-1}`;
//    
//    let markdownPath = path.resolve(chapter.path);
//    let markdownData = fs.readFileSync(markdownPath, {encoding: "utf-8"});
//    let htlmString = mdparser.parse_markdown(markdownData);
//    return {
//        id: parentDocument.document_id,
//        title: parentDocument.title,
//        subtitle: parentDocument.subtitle,
//        author: parentDocument.author,
//        markdown: markdownData,
//        output: htlmString,
//        chapterNumber: parseInt(chapterIndex),
//        next: nextChapterURL,
//        previous: prevChapterURL,
//    };
//}
//
//async function editDocumentChapter(libraryId, documentId, chapterIndex, textContent) {
//    let library = libraries.find(obj => obj.id === libraryId);
//    let parentDocument = library.documents.find(obj => obj.document_id === documentId);
//    if(!parentDocument) {
//        throw "ERROR: The parent document could not be located.";
//    }
//    let chapter = parentDocument.chapters[chapterIndex];
//    if(!chapter) {
//        throw "ERROR: The requested chapter could not be located.";
//    }
//    fs.writeFileSync(path.resolve(chapter.path), textContent.toString(), {encoding: "utf-8"});
//}
//
//export default {loadLibrary, loadDocumentChapter, editDocumentChapter};