const express = require('express');
const app = express();
const port = 3111;

let fire = false;
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

app.get('/forrest', (req, res) => {
    res.render("forrest", {fire, has_torch, has_key});
})

app.get('/gate', (req, res) => {
    res.render("gate", {has_log, has_key, gate_unlocked, gate_smashed});
}); 

app.get('/garden/smash', (req, res) => {
    gate_smashed = true;
    res.render("fight", {has_bow, has_torch, loud:true});
}); 
app.get('/garden/key', (req, res) => {
    gate_unlocked = true;
    res.render("garden");
}); 


app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});