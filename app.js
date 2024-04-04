const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const warpAsync = require("./utils/warpAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema} = require("./schema.js")


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


const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//Index Routes
app.get("/listing", warpAsync(async (req,res) =>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", {allListing});
}));


//New Listing
app.get("/listing/new" , (req,res) => {
    res.render("listing/newListing.ejs");
});

//Show Routes
app.get("/listing/:id", validateListing, warpAsync(async (req,res) =>{
    let {id} = req.params;
    const listingShow = await Listing.findById(id);
    res.render("listing/show.ejs",{listingShow});
    console.log(listingShow);
}));



// create Routes 
app.post("/listings", validateListing, warpAsync(async (req,res,next) => {
    // let {result} = listingSchema.validate(req.body);
    //     console.log(e);
    //     let ListingObj = req.body.listing;  // dricet pass object 
        const newListing = new Listing(ListingObj);
        // console.log(newListing);
        await newListing.save();
    
        res.redirect("/listing");
}));



// Edit Routes
app.get("/listing/:id/edit", warpAsync(async (req,res) =>{
    let {id} = req.params;
    const listingShow = await Listing.findById(id);
    res.render("listing/editListing.ejs" ,{listingShow});
}));


//Update Routes
app.put("/listing/:id/" , validateListing, warpAsync(async (req,res) =>{

    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`);
}));

// DELETE Routrs
app.delete("/listing/:id", warpAsync(async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    // console.log(deletelisting);
    res.redirect("/listing");
}));



// invalid Routes error
app.all("*" , (req,res,next) =>{
    next(new ExpressError(404 ,"Page Not Found!"))
})


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