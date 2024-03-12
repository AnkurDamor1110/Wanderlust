const mongoose =  require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

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


const initDB = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initializes");
};

initDB();