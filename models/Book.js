import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: 1,
        maxLength: 40,
        required: true
    },
    subtitle: {
        type: String,
        minLength: 1,
        maxLength: 40,
        required: false
    },
    author: {
        type: String,
        maxLength: 30,
        required: true
    },
    coauthors: [
        {
            type: String,
            maxLength: 30,
            required: false
        }
    ],
    type: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: false
    }
});

export default mongoose.model("book", bookSchema);
