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
        let parentBook = await Book.findById(bookQuery);
        if(!parentBook) {
            res.status(404).render("pages/error", {
                message: "Sorry, the book could not be located.",
                status: "404 - Not found."
            });
        }
        let chapterId = parentBook.chapters[chapterQuery];  
        if(!chapterId) {
            // TODO: Should include a message that says the requested chapter
            // wasn't found and user is redirected to book index
            chapterId = parentBook.chapters[0];
        }
        let chapterNumber;
        for(let i = 0; i < parentBook.chapters.length; i++) {
            if(parentBook.chapters[i] === chapterId) {
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
                book: parentBook,
                chapter: chapterData,
                htmlOutput: htmlOutput,
                chapterNumber: chapterNumber,
                nextChapter: `/read/${parentBook.id}?chapter=${nextQuery}`,
                prevChapter: `/read/${parentBook.id}?chapter=${prevQuery}`,
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
            status: "404 - Not found."
        });
    }
}

async function updateChapter(req, res) {
    let chapter = await Chapter.findById(req.params.chapterId);
    if(!chapter) {
        res.status(404).render("pages/error", {
            message: "Sorry, the chapter could not be updated.",
            status: "404 - Not found."
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
    chapter.save()
        .then((result) => {
            console.log(`[ DEBUG ] ${result}`);
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(`[ DEBUG ] ${err}`);
            res.status(404).render("pages/error", {
                message: "The chapter could not be saved.",
                status: "500 - Internal server error."
            });
        });
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
        parentBook.chapters.push(newChapter.id);
        // TODO: Why does this cause an error?
        parentBook.save()
            .then((result) => {
                console.log(`[ DEBUG ] ${result}`);
                res.redirect(`/read/${parentBook.id}?chapter=${parentBook.length-1}`);
            })
            .catch((err) => {
                console.log(`[ DEBUG ] ${err}`);
                res.status(500).render("pages/error", {
                    message: "The new chapter was created, but could not be added to the book's chapter list.",
                    status: "500 - Internal server error."
                });
            })
    } catch {
        res.status(500).render("pages/error", {
            message: "The new chapter could not be created.",
            status: "500 - Internal server error."
        });
    }
}

export default {readChapter, updateChapter, createChapter};
