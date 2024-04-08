const Listing = require("../models/listing");

module.exports.index = async (req,res) =>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", {allListing});
};


module.exports.renderNewForm = (req,res) => {
    res.render("listing/newListing.ejs");
};

module.exports.showListing = async (req,res) =>{
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
};


module.exports.createListing = async (req,res,next) => {
    // let {result} = listingSchema.validate(req.body);
    //     console.log(e);
        let url = req.file.path;
        let filename = req.file.filename;

        let ListingObj = req.body.listing;  // dricet pass object 
        const newListing = new Listing(ListingObj);
        // console.log(newListing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        await newListing.save();
        req.flash("success" , "New Listing Created!");
        res.redirect("/listing");
};


module.exports.randerEditForm = async (req,res) =>{
    let {id} = req.params;
    const listingShow = await Listing.findById(id);
    if(!listingShow){
        req.flash("error" , "Listing you requested does not exit!");
        res.redirect("/listing");
    }
    res.render("listing/editListing.ejs" ,{listingShow});
};


module.exports.updateListing = async (req,res) =>{

    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    // console.log(deletelisting);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listing");
};