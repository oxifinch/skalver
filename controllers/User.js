import User from "../models/User.js";
import bcrypt from "bcrypt";

async function createUser(req, res, next) {
    const {username, password} = req.body;
    if(!username || !password) {
        res.redirect("/register");
    }
    let userExists = await User.exists({username: username});
    if(userExists) {
        res.redirect("/login");
        next();
    } else if (!userExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        User.create({
            username: username,
            password: hashedPassword,
            libraries: [],
            activeLibrary: null
        })
        .then((result) => {
            req.session.userName = result.username;
            req.session.userId = result.id;
            res.redirect("/controlpanel");
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
        res.redirect("/login");
        next();
    } else {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) {
            res.redirect("/login");
            next();
        } else if (passwordMatch) {
            req.session.userName = user.username;
            req.session.userId = user.id;
            res.status(200).redirect("/controlpanel");
        }
    }
}

async function logoutUser(req, res, next) {
    req.session.destroy((err) => {
        if(err) {
            return res.status(500).redirect("/controlpanel");
        }
        res.clearCookie();
        res.status(200).redirect("/");
    })
}

async function loadUserControlpanel(req, res, next) {
    if(!req.session.userName || !req.session.userId) {
        res.redirect("/login");
    }
    const user = await User.findById(req.session.userId)
        .populate({
            path: "libraries"
        })
        .exec();
    if(!user) {
        res.status(404).render("pages/error", {
            message: "You user account could not be located.",
            status: "404 - Not found."
        });
    } else {
        res.status(200).render("pages/controlpanel", {
            user: user 
        });
    }

}

export default {
    createUser, 
    loginUser,
    logoutUser,
    loadUserControlpanel
};
