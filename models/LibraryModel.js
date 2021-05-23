import fs from "fs";
import path from "path";

const libraries = JSON.parse(fs.readFileSync(path.resolve("./data/testdb.json")));

// TODO: All of this is just for quick prototyping - need to implement actual
// MongoDB database with mongoose!

function loadLibrary(id) {
    const library = libraries.find(obj => obj.id === id); 
    if(!library) {
        // TODO: Add proper error handling
        return false;
    } else {
        return library;
    }
}

export default {loadLibrary};
