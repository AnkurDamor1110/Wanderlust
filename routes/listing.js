const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const warpAsync = require("../utils/warpAsync.js");
const {isLoggedIn ,isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});

//Index Routes  create Routes 
router.route("/")
        .get(warpAsync(listingController.index))
        .post(
            isLoggedIn,
            upload.single("listing[image]"), 
            validateListing, 
            warpAsync(listingController.createListing) );


//New Listing
router.get("/new" , isLoggedIn, listingController.renderNewForm);

//Show Routes Update Routes DELETE Routrs
router.route("/:id")
        .get(warpAsync(listingController.showListing))
        .put(isLoggedIn, isOwner, validateListing,  warpAsync(listingController.updateListing))
        .delete(isLoggedIn, isOwner, warpAsync(listingController.destroyListing));

// Edit Routes
router.get("/:id/edit",isLoggedIn, isOwner, warpAsync(listingController.randerEditForm));


module.exports = router;