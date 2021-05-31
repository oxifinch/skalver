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
            console.log(result);
        })
        .catch(err => console.log(err));
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
            if(!user.activeLibrary || user.libraries.length === 0) {
                res.redirect("/controlpanel/libraries");
                next();
            } else {
                res.redirect("/dashboard");
                next();
            }
        }
    }
}

async function logoutUser(req, res, next) {
    // TODO: Destroy session and return to login page
}

export default {
    createUser, 
    loginUser
};
