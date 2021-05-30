import Book from "../models/Book.js";
import Chapter from "../models/Chapter.js";
import mdparser from "skalver-mdparser";

async function readChapter(req, res) {
    let bookQuery = req.params.bookId;
    let chapterQuery = parseInt(req.query.chapter);
    if(!chapterQuery) {
        chapterQuery = 0;
    }
    try {
        let bookData = await Book.findById(bookQuery)
            .select([
                "title",
                "author",
                "chapters"
            ])
            .exec();
        let chapterId = bookData.chapters[chapterQuery];  
        if(!chapterId) {
            // TODO: Should include a message that says the requested chapter
            // wasn't found and user is redirected to book index
            chapterId = bookData.chapters[0];
        }
        let chapterNumber;
        for(let i = 0; i < bookData.chapters.length; i++) {
            if(bookData.chapters[i] === chapterId) {
                chapterNumber = i;
                break;
            }
        }
        let nextQuery = chapterNumber + 1;
        let prevQuery = chapterNumber < 1 ? 0 : chapterNumber - 1;
        try {
            let chapterData = await Chapter.findById(chapterId);
            let htmlOutput = mdparser.parse_markdown(chapterData.markdown);
            res.status(200).render("pages/read", {
                book: bookData,
                chapter: chapterData,
                htmlOutput: htmlOutput,
                chapterNumber: chapterNumber,
                nextChapter: `/read/${bookData.id}?chapter=${nextQuery}`,
                prevChapter: `/read/${bookData.id}?chapter=${prevQuery}`,
            });

        } catch {
            res.status(404).render("pages/error", {
                message: "Sorry, the resource you requested could not be located.",
                status: "404 - Resource not found."
            });
        }
    } catch {
        res.status(404).render("pages/error", {
            message: "Sorry, the resource you requested could not be located.",
            status: "404 - Resource not found."
        });
    }
}

async function updateChapter(req, res) {
    let chapter = await Chapter.findById(req.params.chapterId);
    if(!chapter) {
        res.status(404).render("pages/error", {
            message: "Sorry, the chapter could not be updated.",
            status: "404 - Resource not found."
        });
    }
    let newMarkdown = req.body.markdown;
    if(!newMarkdown) {
        res.status(404).render("pages/error", {
            message: "Sorry, the new text content could not be transmitted.",
            status: "404 - New text data not found."
        });
    }
    chapter.markdown = newMarkdown.toString();
    let savedChapter = await chapter.save();
    if(!savedChapter) {
        res.status(500).render("pages/error", {
            message: "The changes to the chapter failed to save.",
            status: "500 - Server could not save changes."
        });

    }
    res.status(200).json(savedChapter);
}

async function createChapter(req, res) {
    let parentBook = await Book.findById(req.params.bookId);
    if (!parentBook) {
        res.status(404).render("pages/error", {
            message: "The book you are trying to add a chapter to could not be located.",
            status: "404 - Not found."
        });
    }
    let {name, tags, markdown} = req.body;
    if (!name) {
        res.status(400).render("pages/error", {
            message: "The new chapter could not be created.",
            status: "400 - No name specified."
        });
    }
    // While a chapter does not need to contain any tags or markdown content, I
    // still want to ensure that the fields exist, so I'm setting them manually
    // if the request does not contain any information.
    if (!tags) {
        tags = [];
    }
    if (!markdown) {
        markdown = `# ${name}`;
    }
    try {
        let newChapter = await Chapter.create({
            name,
            markdown,
            tags
        });
        try {
            parentBook.chapters.push(newChapter.id);
            // TODO: Why does this cause an error?
            await parentBook.save();
            res.status(200).json(newChapter);
        } catch {
            res.status(500).render("pages/error", {
                message: "The new chapter was created, but could not be added to the book's chapter list.",
                status: "500 - Internal server error."
            });
        }
    } catch {
        res.status(500).render("pages/error", {
            message: "The new chapter could not be created.",
            status: "500 - Internal server error."
        });
    }
}

export default {readChapter, updateChapter, createChapter};
