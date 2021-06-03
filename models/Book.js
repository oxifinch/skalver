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
        minLength: 1,
        maxLength: 60,
        required: false
    },
    description: {
        type: String,
        minLength: 1,
        maxLength: 5000,
        required: false
    },
    author: {
        type: String,
        minLength: 1,
        maxLength: 60,
        required: false
    },
    coauthors: [
        {
            type: String,
            maxLength: 60,
            required: false
        }
    ],
    type: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: false
    },
    chapters: [
        {type: mongoose.Types.ObjectId, ref: "chapter"}
    ],
    tags: [
        {
            type: String, 
            minLength: 2,
            maxLength: 30,
            required: false,
        }
    ],
}, {collection: "books"});

export default mongoose.model("book", bookSchema);
