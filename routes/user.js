const express = require("express");
const router = express.Router();
const User =  require("../models/user");
const warpAsync = require("../utils/warpAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", warpAsync( async (req,res) => {
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
    
}));

router.get("/login" , (req,res) =>{
    res.render("users/login.ejs");
});

router.post("/login" , saveRedirectUrl,
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}) ,
    async (req,res) => {
        req.flash( "success" , "Welcome back to wanderlust!");
        let  redirectUrl = res.locals.redirectUrl || "/listing";
        res.redirect(redirectUrl);
});

router.get("/logout" , (req,res,next) => {
    req.logOut((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success" , "you are logged out!");
        res.redirect("/listing");
    });

})
module.exports = router;