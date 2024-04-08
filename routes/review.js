const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const warpAsync = require("../utils/warpAsync.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controller/review.js");
// Reviews
// Post Review Route
router.post("/", isLoggedIn, validateReview, warpAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, warpAsync(reviewController.destroyReview));


module.exports = router;