if(process.env.NODE_ENV != "producation"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine" ,"ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname , "/public")));
// connection to DB
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then((res) =>{
        console.log("Connected to DB");
    }).catch((err) =>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}

const sessionoptions = {
    secret: "mysecretstring", 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.get("/" , (req,res) => {
    res.send("Hi! I am root...");
});


app.use(session(sessionoptions));
app.use(flash());

//possport 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()) );

//serialize and deserialize 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req,res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "student",
//     });
//     let registerUser = await User.register(fakeUser, "helloworld");
//     res.send(registerUser);
//     //Hash Function use --> pbkdf2
// });

app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRouter);
app.use("/", userRouter);

// invalid Routes error
app.all("*" , (req,res,next) =>{
    next(new ExpressError(404 ,"Page Not Found!"))
});


// Error handeling Midllerware 
app.use((err,req,res,next) =>{
    let {status=500 , message="Some Error Occurred"} = err;
    res.status(status).render("error.ejs", {message});
    // res.status(status).send(message);
});


// connection to Express

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});