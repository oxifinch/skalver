import User from "../models/User.js";
import bcrypt from "bcrypt";

async function createUser(req, res, next) {
    const {username, password} = req.body;
    if(!username || !password) {
        res.redirect("/register");
    }
    let userExists = await User.exists({username: username});
    console.log(userExists);
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
            res.redirect("/dashboard")
            next();
        }
    }
}

export default {createUser, loginUser};
