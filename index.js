const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

let location = "crossroads";
let fire = false;
let met_knight = false;
let gate_unlocked = false;
let gate_smashed = false;
let has_torch = false;
let has_bow = false;
let has_key = false;
let has_log = false;


app.set("view engine","ejs")

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render("crossroads");
    location = "crosroads";
}); 

app.get('/reset', (req, res) => {
    location = "crossroads";
    fire = false;
    met_knight = false;
    gate_unlocked = false;
    gate_smashed = false;
    has_torch = false;
    has_bow = false;
    has_key = false;
    has_log = false;
    res.render("crossroads");
}); 

app.get('/about', (req, res) => {
    //TBD info page
}); 

app.get('/exit', (req, res) => {
    //TBD giving up page
}); 

app.get('/fight/bow', (req, res) => {
    res.render("end", {ending: "bow"});
});
app.get('/fight/fists', (req, res) => {
    res.render("end", {ending: "fists"});
}); 
app.get('/fight/torch', (req, res) => {
    res.render("end", {ending: "torch"});
}); 
app.get('/fight', (req, res) => {
    res.render("fight", {has_bow, has_torch, loud:false});
}); 

app.get('/forest/talk', (req, res) => {
    if(req.query.answer === "river") {
        has_key = true;
    }
    res.render("talk", {stage:req.query.answer})
})
app.get('/forest/cook', (req, res) => {
    if(req.query.stage === "cooked") {
        has_torch = true;
        fire = true;
    }
    res.render("cook", {stage:req.query.stage})
})
app.get('/forest', (req, res) => {
    res.render("forest", {fire, met_knight, has_torch, has_key, location});
    location = "forest";
    met_knight = true;
})



app.get('/gate', (req, res) => {
    res.render("gate", {has_log, has_key, gate_unlocked, gate_smashed});
    location = "garden";
}); 

app.get('/garden/smash', (req, res) => {
    gate_smashed = true;
    res.render("fight", {has_bow, has_torch, loud:true});
}); 
app.get('/garden/key', (req, res) => {
    gate_unlocked = true;
    res.render("garden");
}); 

app.get('/swamp', (req, res) => {
    //TBD swamp path
}); 


app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});