const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const flash = require("connect-flash");


app.set("view engine" ,"ejs");
app.set("views" , path.join(__dirname,"views"));

const sessionoptions = {
    secret: "mysecretstring", 
    resave: false, 
    saveUninitialized: true
}
app.use(session(sessionoptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.failerMsg = req.flash("failer");
    next();
});
app.get("/register" , (req,res) =>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("failer", " user not register");
    }else {
        req.flash("success" , "user registered successfuly");
    }
  
    res.redirect("/hello");
});

app.get("/hello" , (req, res) =>{
    // res.render("page.ejs" , {name : req.session.name , msg: req.flash("success")});
    // when we use middleware and locals
    res.render("page.ejs" , {name : req.session.name});
});

// app.get("/reqcount" ,(req,res) =>{
//     if(req.session.count){
//         req.session.count++;
//     } else {
//         req.session.count =1;
//     }

//     res.send(`You sent a req ${req.session.count} times`);
// });

// app.get("/test", (req,res) => {
//     res.send("test successful ");
// });

app.listen(3000, ()=>{
    console.log("server is listening on port 3000");
});