import Book from "../models/Book.js";

async function getBookInfo(req, res) {
    let bookQuery = req.params.bookId;
    try {
        let bookData = await Book.findOne(bookQuery);
        res.status(200).json(bookData);
    } catch {
        res.status(404).render("pages/error", {
            message: "Sorry, the resource you requested could not be located.",
            status: "404 - Resource not found."
        });
    }
}

export default {getBookInfo};
