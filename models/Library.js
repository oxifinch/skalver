import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 2,
        maxLength: 60,
        required: true
    },
    description: {
        type: String,
        maxLength: 5000,
        required: true
    },
    //sections: [
    //    {type: mongoose.Types.ObjectId, ref: "section"}
    //],
    books: [
        {type: mongoose.Types.ObjectId, ref: "book"}
    ],
    wallpaper: {
        type: String,
        maxLength: 1000,
        required: false
    }
}, {collection: "libraries"});

export default mongoose.model("library", librarySchema);
