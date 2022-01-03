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
    const userID = users.findIndex((user) => user.name === req.session.username)
    res.render("crossroads", {user: req.session.username});
    users[userID].location = "crossroads";
}); 

app.get('/reset', LoginVerification, (req, res) => {
    const userID = users.findIndex((user) => user.name === req.session.username)
    users[userID].location = "crossroads";
    users[userID].fire = false;
    users[userID].met_knight = false;
    users[userID].gate_unlocked = false;
    users[userID].gate_smashed = false;
    users[userID].has_torch = false;
    users[userID].has_bow = false;
    users[userID].has_key = false;
    users[userID].has_log = false;
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
    const userID = users.findIndex((user) => user.name === req.session.username);
    res.render("fight", {has_bow: users[userID].has_bow, has_torch: users[userID].has_torch, loud:false, user: req.session.username});
}); 

app.get('/forest/talk', LoginVerification, (req, res) => {
    const userID = users.findIndex((user) => user.name === req.session.username);
    if(req.query.answer === "river") {
        users[userID].has_key = true;
    }
    res.render("talk", {stage:req.query.answer, user: req.session.username})
})
app.get('/forest/cook', LoginVerification, (req, res) => {
    const userID = users.findIndex((user) => user.name === req.session.username);
    if(req.query.stage === "cooked") {
        users[userID].has_torch = true;
        users[userID].fire = true;
    }
    res.render("cook", {stage:req.query.stage, user: req.session.username})
})
app.get('/forest', LoginVerification, (req, res) => {
    const userID = users.findIndex((user) => user.name === req.session.username);
    res.render("forest", {fire: users[userID].fire, met_knight: users[userID].metKnight, has_torch: users[userID].has_torch, has_key: users[userID].has_key, location: users[userID].location, user: req.session.username});
    users[userID].location = "forest";
    users[userID].met_knight = true;
})



app.get('/gate', LoginVerification, (req, res) => {
    const userID = users.findIndex((user) => user.name === req.session.username);
    res.render("gate", {has_log: users[userID].has_log, has_key: users[userID].has_key, gate_unlocked: users[userID].gate_unlocked, gate_smashed: users[userID].gate_smashed, user: req.session.username});
    users[userID].location = "garden";
}); 

app.get('/garden/smash', LoginVerification, (req, res) => {
    const userID = users.findIndex((user) => user.name === req.session.username);
    users[userID].gate_smashed = true;
    res.render("fight", {has_bow: users[userID].has_bow, has_torch: users[userID].has_torch, loud:true, user: req.session.username});
}); 
app.get('/garden/key', LoginVerification, (req, res) => {
    const userID = users.findIndex((user) => user.name === req.session.username);
    users[userID].gate_unlocked = true;
    res.render("garden", {user: req.session.username});
}); 

app.get('/swamp/cabin', LoginVerification, (req, res) => {
    const userID = users.findIndex((user) => user.name === req.session.username);
    res.render("cabin", {has_bow: users[userID].has_bow, has_log: users[userID].has_log, user: req.session.username})
}); 
app.get('/swamp/sticks', LoginVerification, (req, res) => {
    const userID = users.findIndex((user) => user.name === req.session.username);
    if(req.query.log === "take") {
        users[userID].has_log = true; 
    }
    res.render("sticks", {has_log: users[userID].has_log, user: req.session.username})
}); 
app.get('/swamp/bow', LoginVerification, (req, res) => {
    const userID = users.findIndex((user) => user.name === req.session.username);
    if(req.query.answer === "truth") {
        users[userID].has_bow = true;
    }
    res.render("witch", {stage: req.query.answer, user: req.session.username});
})
app.get('/swamp', LoginVerification, (req, res) => {
    res.render("swamp", {user: req.session.username});
}); 


app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});

