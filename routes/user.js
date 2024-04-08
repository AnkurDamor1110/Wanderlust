const express = require("express");
const router = express.Router();
const User =  require("../models/user");
const warpAsync = require("../utils/warpAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controller/user");

router.get("/signup", userController.renderSinupform);

router.post("/signup", warpAsync(userController.signup ));

router.get("/login" , userController.renderLoginForm);

router.post("/login" , saveRedirectUrl,
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}) ,
    userController.login);


    
router.get("/logout" , userController.logout);


module.exports = router;