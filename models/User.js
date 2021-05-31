import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        maxLength: 40,
        required: true
    },
    password: {
        type: String,
        minLength: 5,
        maxLength: 100,
        required: true
    },
    activeLibrary: {
        type: mongoose.Types.ObjectId,
        ref: "library",
        required: false
    },
    libraries: [
        {type: mongoose.Types.ObjectId, ref: "library"}
    ]
}, {collection: "users"});

export default mongoose.model("user", userSchema);
