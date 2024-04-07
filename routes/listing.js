const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const warpAsync = require("../utils/warpAsync.js");
const {isLoggedIn ,isOwner , validateListing} = require("../middleware.js");


//Index Routes
router.get("/", warpAsync(async (req,res) =>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", {allListing});
}));


//New Listing
router.get("/new" , isLoggedIn, (req,res) => {
    res.render("listing/newListing.ejs");
});

//Show Routes
router.get("/:id", warpAsync(async (req,res) =>{
    let {id} = req.params;
    const listingShow = await Listing.findById(id)
                        .populate( {
                             path :"reviews", 
                             populate:{
                                path: "author"
                            },
                        })
                        .populate("owner");
    if(!listingShow){
        req.flash("error" , "Listing you requested does not exit!");
        res.redirect("/listing");
    }
    res.render("listing/show.ejs",{listingShow});
    console.log(listingShow);
}));



// create Routes 
router.post("/", validateListing, isLoggedIn, warpAsync(async (req,res,next) => {
    // let {result} = listingSchema.validate(req.body);
    //     console.log(e);
        let ListingObj = req.body.listing;  // dricet pass object 
        const newListing = new Listing(ListingObj);
        // console.log(newListing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success" , "New Listing Created!");
        res.redirect("/listing");
}));



// Edit Routes
router.get("/:id/edit",isLoggedIn, isOwner, warpAsync(async (req,res) =>{
    let {id} = req.params;
    const listingShow = await Listing.findById(id);
    if(!listingShow){
        req.flash("error" , "Listing you requested does not exit!");
        res.redirect("/listing");
    }
    res.render("listing/editListing.ejs" ,{listingShow});
}));


//Update Routes
router.put("/:id/" ,isLoggedIn, isOwner, validateListing,  warpAsync(async (req,res) =>{

    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listing/${id}`);
}));

// DELETE Routrs
router.delete("/:id", isLoggedIn, isOwner, warpAsync(async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    // console.log(deletelisting);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listing");
}));



module.exports = router;