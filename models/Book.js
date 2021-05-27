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
    authors: [
        {
            type: String,
        }
    ]
});

export default mongoose.model("book", bookSchema);
