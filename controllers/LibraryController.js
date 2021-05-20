import express from "express";
import LibraryModel from "../models/LibraryModel.js";

function getAll(req, res) {
    res.status(200).json(LibraryModel.loadAll()); 
}

export default {getAll};
