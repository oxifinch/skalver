import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: 1,
        maxLength: 60,
        required: true
    },
    subtitle: {
        type: String,
        maxLength: 60,
        default: "",
        required: false
    },
    description: {
        type: String,
        maxLength: 5000,
        default: "",
        required: false
    },
    author: {
        type: String,
        minLength: 1,
        maxLength: 60,
        default: "Unknown Author",
        required: false
    },
    coauthors: [
        {
            type: String,
            maxLength: 60,
            required: false
        }
    ],
    bookType: {
        type: String,
        maxLength: 60,
        default: "",
        required: false
    },
    chapters: [
        {type: mongoose.Types.ObjectId, ref: "chapter"}
    ],
    tags: [
        {
            type: String, 
            minLength: 1,
            maxLength: 30,
            required: false,
        }
    ],
}, {collection: "books"});

export default mongoose.model("book", bookSchema);
