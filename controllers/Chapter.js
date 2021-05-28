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

export default {readChapter, updateChapter};
