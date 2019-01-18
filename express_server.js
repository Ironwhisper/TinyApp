const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

let urlDatabase = [
  {
    id: "b2xVn2",
    long: "http://www.lighthouselabs.ca",
  },
  {
    id: "9sm5xK",
    long: "http://www.google.com"
  }
];

let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


function generateRandomString() {

  function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  const ABC = "0123456789ABCDEFGHIJKLOMNQPRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

  let result = "";
  for (let i = 0; i < 6; i++){
    result += ABC.charAt(getRndInteger(0, ABC.length-1))
  }
  return result;
}


//FIGURE OUT THAT ERROR WITH .long

//INDEX PAGE
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    guest: req.cookies["guest"]
    };
  res.render("urls_index", templateVars);
});

//URLS_NEW
app.get("/urls/new", (req, res) => {
  const templateVars = {
  guest: req.cookies["guest"],
};
  res.render("urls_new", templateVars);
});

//REDIRECT
app.post("/urls", (req, res) => {
  let randomId = generateRandomString();
  urlDatabase.push({id: randomId, long: req.body.longURL})
  let target_url = "/urls/" + randomId
  res.redirect(target_url)
});

//SHOW URL
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase,
    guest: req.cookies["guest"]
  };
  res.render("urls_show", templateVars);
});

//DELETE
app.post("/urls/:id/delete", (req, res) => {
  urlDatabase.find( x => x.id == req.params.id).long = null;
  urlDatabase.find( x => x.id == req.params.id).id = null;
  res.redirect("/urls");
});

//UPDATE
app.post("/urls/:id/update", (req, res) => {
  let foundUrl = urlDatabase.find( x => x.id == req.params.id)
  foundUrl.long = req.body.updURL;
  res.redirect(`/urls/${foundUrl.id}`);
});

//SETTING A SHORT URL ADDRESS
app.get("/u/:shortURL", (req, res) => {
  let id = req.params.shortURL;
  let longURL = urlDatabase.find( x => x.id == id).long
  if (
    longURL.substring(0,7) !== "https://" ||
    longURL.substring(0,6) !== "http://") {
    res.send("Improper URL !")
  }
  res.redirect(longURL);
});

////////////////////////////////////////////////////////////

//REGISTER PAGE
app.get("/register", (req, res) => {
  let templateVars = {
    guest: req.cookies["guest"]
  };
  res.render("urls_register", templateVars)
})

//REGISTER ACTION
app.post("/register", (req, res) => {

  const userID = generateRandomString();

  if (!req.body.email || !req.body.password) {
    res.status(400).send('Invalid email or password.');
    return;
  }

  const userDB = Object.values(users);

  if (userDB.find(x => x.email === req.body.email)) {
    res.status(400).send("That email is already in use!");
    return;
  }

  else users.userID = {
    id : userID,
    email : req.body.email,
    password : req.body.password
  }
  res.redirect("/login");
})

//LOGIN PAGE
app.get("/login", (req, res) => {
  let templateVars = {
    guest: req.cookies["guest"]
  };  res.render("urls_login", templateVars)
})

//LOGIN POST
app.post("/login", (req,res) => {
// LOOK FOR EXISTING USER< AND CHECK IF PASSWORDS MATCH< THEN SET COOKIE WITH USER'S UNIQUE ID
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Empty email or password fields.');
    return;
  }
  const userDB = Object.values(users);

  const userBeing = userDB.find(x => x.email === req.body.email)

  if (!userBeing) {
    res.status(403).send("That email is not in the directory");
    return;
  }

  if (userBeing.password !== req.body.password) {
    res.send("Incorrect Password!");
    return;
  }

  res.cookie("guest", userBeing.id);
  res.redirect("/urls");
})

//LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("guest")
  res.redirect("/urls");
})

//ROOT PAGE
app.get("/", (req, res) => {
  res.send("Hello!");
});


//INITIATE SERVER
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

// What would happen if a client requests a non-existent shortURL?
// What happens to the urlDatabase when the server is restarted?
// Should your redirects be 301 or 302 - What is the difference?