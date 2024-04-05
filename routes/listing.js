const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const warpAsync = require("../utils/warpAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");


const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//Index Routes
router.get("/", warpAsync(async (req,res) =>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", {allListing});
}));


//New Listing
router.get("/new" , (req,res) => {
    res.render("listing/newListing.ejs");
});

//Show Routes
router.get("/:id", warpAsync(async (req,res) =>{
    let {id} = req.params;
    const listingShow = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs",{listingShow});
    console.log(listingShow);
}));



// create Routes 
router.post("/", validateListing, warpAsync(async (req,res,next) => {
    // let {result} = listingSchema.validate(req.body);
    //     console.log(e);
        let ListingObj = req.body.listing;  // dricet pass object 
        const newListing = new Listing(ListingObj);
        // console.log(newListing);
        await newListing.save();
    
        res.redirect("/listing");
}));



// Edit Routes
router.get("/:id/edit", warpAsync(async (req,res) =>{
    let {id} = req.params;
    const listingShow = await Listing.findById(id);
    res.render("listing/editListing.ejs" ,{listingShow});
}));


//Update Routes
router.put("/:id/" , validateListing, warpAsync(async (req,res) =>{

    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`);
}));

// DELETE Routrs
router.delete("/:id", warpAsync(async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    // console.log(deletelisting);
    res.redirect("/listing");
}));



module.exports = router;