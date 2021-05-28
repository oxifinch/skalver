import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 1,
        maxLength: 40,
        required: true
    },
    markdown: {
        type: String, 
        maxLength: 50000,
        required: true
    },
    tags: [
        {
            type: String,
            minLength: 2,
            maxLength: 30,
            required: false
        }
    ]
});

export default mongoose.model("chapter", chapterSchema);
