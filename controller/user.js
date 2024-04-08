const User = require("../models/user");

module.exports.renderSinupform = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req,res) => {
    try {
        let {email,username,password} = req.body;
        const newUser =  new User({email,username});
        const registerUser = await User.register(newUser , password);
        console.log(registerUser);
        req.login(registerUser, (err) =>{
            if(err){
                next(err);
            }
            req.flash("success" , "Welcome to Wanderlust!");
            res.redirect("/listing");
        });
 
    } catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm =  (req,res) =>{
    res.render("users/login.ejs");
};


module.exports.login = async (req,res) => {
    req.flash( "success" , "Welcome back to wanderlust!");
    let  redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next) => {
    req.logOut((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success" , "you are logged out!");
        res.redirect("/listing");
    });

};