import User from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

async function createUser(req, res, next) {
    const {username, password} = req.body;
    if(!username || !password) {
        res.redirect("/register");
    }
    let userExists = await User.exists({username: username});
    if(userExists) {
        res.redirect("/");
        next();
    } else if (!userExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        User.create({
            username: username,
            password: hashedPassword,
            libraries: [],
            activeLibrary: new mongoose.mongo.ObjectId()
        })
        .then((result) => {
            req.session.userName = result.username;
            req.session.userId = result.id;
            res.redirect("/dashboard");
        })
        .catch(err => {
            console.log(err);
            res.status(500).render("pages/error", {
                message: "Sorry, the user account could not be created. Please try again later.",
                status: "500 - Internal server error."
            });
        });
    }
}

async function loginUser(req, res, next) {
    const {username, password} = req.body; 
    const user = await User.findOne({username: username}).exec();
    if(!user) {
        res.redirect("/");
        next();
    } else {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) {
            res.redirect("/");
            next();
        } else if (passwordMatch) {
            req.session.userName = user.username;
            req.session.userId = user.id;
            res.status(200).redirect("/dashboard");
        }
    }
}

async function logoutUser(req, res, next) {
    req.session.destroy((err) => {
        if(err) {
            return res.status(500).redirect("/dashboard");
        }
        res.clearCookie();
        res.status(200).redirect("/");
    })
}

async function loadUserDashboard(req, res) {
    if(!req.session.userName || !req.session.userId) {
        res.redirect("/");
    }
    User.findById(req.session.userId)
        .populate({
            path: "libraries"
        })
        .exec()
        .then((user) => {
            res.status(200).render("pages/dashboard", {
                user: user
            });
        })
        .catch(() => {
            res.status(404).render("pages/error", {
                message: "Your user account could not be located.",
                status: "404 - Not found."
            });
        });
}

export default {
    createUser, 
    loginUser,
    logoutUser,
    loadUserDashboard
};
