const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
var session = require('express-session');

app.use(express.urlencoded({extended: true}));
app.use(express.json()); // To parse the incoming requests with JSON payloads


app.use(session({
  secret: 'excelsior',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

var LoginVerification = (req, res, next) => {
    if(req.session.username) {
        next();
    } else {
        res.redirect("/")
    }
}


let location = "crossroads";
let fire = false;
let met_knight = false;
let gate_unlocked = false;
let gate_smashed = false;
let has_torch = false;
let has_bow = false;
let has_key = false;
let has_log = false;

const users = [
    {name: "Outlander", 
    location: "crossroads",
    fire: false,
    met_knight: false,
    gate_unlocked: false,
    gate_smashed: false,
    has_torch: false,
    has_bow: false,
    has_key: false,
    has_log: false
}
]


app.set("view engine","ejs")

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    const session_username = req.session.username ? req.session.username : "user not found";
    res.render("index", {user: session_username})
}); 

app.post('/signin', (req, res) => {
    const username = req.body.username;
    if(users.find(user => user.name === req.body.username)) {
        req.session.username = username;
        res.redirect("/crossroads");
    } else {
        req.session.temp = username
        res.render("create", {name: username})
    }
}); 

app.get('/signup', (req, res) => {
    users.push({
        name: req.session.temp,
        fire: false,
        met_knight: false,
        gate_unlocked: false,
        gate_smashed: false,
        has_torch: false,
        has_bow: false,
        has_key: false,
        has_log: false
    })
    req.session.username = req.session.temp;
    res.render("crossroads", {user: req.session.username})
})

app.get('/crossroads', LoginVerification, (req, res) => {
    res.render("crossroads", {user: req.session.username});
    location = "crossroads";
}); 

app.get('/reset', LoginVerification, (req, res) => {
    location = "crossroads";
    fire = false;
    met_knight = false;
    gate_unlocked = false;
    gate_smashed = false;
    has_torch = false;
    has_bow = false;
    has_key = false;
    has_log = false;
    res.render("crossroads", {user: req.session.username});
}); 

app.get('/about', (req, res) => {
    res.render("about")
}); 

app.get('/exit/quitter', LoginVerification, (req, res) => {
    res.render("end", {ending: "quitter", user: req.session.username})
}); 
app.get('/exit', LoginVerification, (req, res) => {
    res.render("exit",{user: req.session.username})
}); 

app.get('/fight/bow', LoginVerification, (req, res) => {
    res.render("end", {ending: "bow", user: req.session.username});
});
app.get('/fight/fists', LoginVerification, (req, res) => {
    res.render("end", {ending: "fists", user: req.session.username});
}); 
app.get('/fight/torch', LoginVerification, (req, res) => {
    res.render("end", {ending: "torch", user: req.session.username});
}); 
app.get('/fight', LoginVerification, (req, res) => {
    res.render("fight", {has_bow, has_torch, loud:false, user: req.session.username});
}); 

app.get('/forest/talk', LoginVerification, (req, res) => {
    if(req.query.answer === "river") {
        has_key = true;
    }
    res.render("talk", {stage:req.query.answer, user: req.session.username})
})
app.get('/forest/cook', LoginVerification, (req, res) => {
    if(req.query.stage === "cooked") {
        has_torch = true;
        fire = true;
    }
    res.render("cook", {stage:req.query.stage, user: req.session.username})
})
app.get('/forest', LoginVerification, (req, res) => {
    res.render("forest", {fire, met_knight, has_torch, has_key, location, user: req.session.username});
    location = "forest";
    met_knight = true;
})



app.get('/gate', LoginVerification, (req, res) => {
    res.render("gate", {has_log, has_key, gate_unlocked, gate_smashed, user: req.session.username});
    location = "garden";
}); 

app.get('/garden/smash', LoginVerification, (req, res) => {
    gate_smashed = true;
    res.render("fight", {has_bow, has_torch, loud:true, user: req.session.username});
}); 
app.get('/garden/key', LoginVerification, (req, res) => {
    gate_unlocked = true;
    res.render("garden", {user: req.session.username});
}); 

app.get('/swamp/cabin', LoginVerification, (req, res) => {
    res.render("cabin", {has_bow, has_log, user: req.session.username})
}); 
app.get('/swamp/sticks', LoginVerification, (req, res) => {
    if(req.query.log === "take") {
        has_log = true; 
    }
    res.render("sticks", {has_log, user: req.session.username})
}); 
app.get('/swamp/bow', LoginVerification, (req, res) => {
    if(req.query.answer === "truth") {
        has_bow = true;
    }
    res.render("witch", {stage: req.query.answer, user: req.session.username});
})
app.get('/swamp', LoginVerification, (req, res) => {
    res.render("swamp", {user: req.session.username});
}); 


app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});

