import fs from "fs";
import path from "path";

const libraries = JSON.parse(fs.readFileSync(path.resolve("./data/testdb.json")));

function loadAll() {
    return libraries;
}

export default {loadAll};
