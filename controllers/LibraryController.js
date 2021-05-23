import express from "express";
import LibraryModel from "../models/LibraryModel.js";

function getAll(req, res) {
    res.status(200).json(LibraryModel.loadAll()); 
}

// Fetch and display the user's active library 
function getActiveLibrary(req, res) {
    // TODO: Look up the user's actual active library and use it to query the
    // database instead of hardcoding it here.
    let activeLibraryId = "123";
    let library = LibraryModel.loadLibrary(activeLibraryId);
    if (!library) {
        res.status(404).json({message: "Library not found."});
    } else {
        res.render("index", {
            libraryName: library.library_name,
            sections: library.sections,
            documents: library.documents,
        });
    }
}

export default {getAll, getActiveLibrary};
