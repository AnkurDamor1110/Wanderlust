const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const warpAsync = require("../utils/warpAsync.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");


// Reviews
// Post Review Route
router.post("/", isLoggedIn, validateReview, warpAsync(async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Created!");
    res.redirect(`/listing/${listing._id}`);
}));

//Delete Review Route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, warpAsync(async (req,res) =>{
    let {id ,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted!");
    res.redirect(`/listing/${id}`);
}));


module.exports = router;