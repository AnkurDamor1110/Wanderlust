const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");


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


app.get("/" , (req,res) => {
    res.send("Hi! I am root...");
});

app.use("/listing", listing);
app.use("/listing/:id/review", review);


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