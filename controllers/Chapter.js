import Book from "../models/Book.js";
import Chapter from "../models/Chapter.js";
import mdparser from "skalver-mdparser";

async function getChapter(req, res) {
    // TODO: Look up the user's actual active library and use it to query the
    // database instead of hardcoding it here.
    let bookQuery = req.params.bookId;
    let chapterQuery = req.query.chapter;
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
        try {
            let chapterData = await Chapter.findById(chapterId);
            let htmlOutput = mdparser.parse_markdown(chapterData.markdown);
            res.status(200).render("pages/read", {
                book: bookData,
                chapter: chapterData,
                htmlOutput: htmlOutput,
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

export default {getChapter};
