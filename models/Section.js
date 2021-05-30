import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 1,
        maxLength: 30,
        required: true
    },
    description: {
        type: String,
        maxLength: 5000,
        required: true
    },
    books: [
        {type: mongoose.Types.ObjectId, ref: "book"}
    ]
}, {collection: "sections"});

export default mongoose.model("section", sectionSchema);
