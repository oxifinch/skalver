import express from "express";
import LibraryModel from "../models/LibraryModel.js";

function getAll(req, res) {
    res.status(200).json(LibraryModel.loadAll()); 
}

function getDocument(req, res) {
    let lib = req.query.library;
    let doc = req.query.doc;
    res.send(LibraryModel.loadDocument(lib, doc));
}

function getChapter(req, res) {
    let lib = req.query.library;
    let doc = req.query.doc;
    let chapter = req.query.chapter;
    res.send(LibraryModel.loadChapter(lib, doc, chapter));
}

export default {getAll, getDocument, getChapter};
