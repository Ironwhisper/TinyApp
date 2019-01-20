
//Dependencies
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["abc"],
  maxAge: 24 * 60 * 60 * 1000
}));

//Emmpty database of urls, to be filled out by the user
let urlDatabase = [];
//Cookies. To be filled out as users register and login.
let users = {};
//Function used to come up with a unique 6 symbol id
function generateRandomString() {
  function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
  const ABC = "0123456789ABCDEFGHIJKLOMNQPRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 6; i++){
    result += ABC.charAt(getRndInteger(0, ABC.length-1));
  }
  return result;
}

//urls_index page get request code
app.get("/urls", (req, res) => {
  function urlsForUser(id) {
    let userURLS = [];
      urlDatabase.forEach(function (x) {
        if (x.userID === id) {
        userURLS.push(x);
      }
    });
    return userURLS;
  }
  if (Object.values(users) === undefined || Object.values(users) === null){
    res.redirect("/login")
  }
  const templateVars = {
    urls: urlsForUser(req.session.guest),
    guest: req.session.guest,
    users: Object.values(users)
    };
  res.render("urls_index", templateVars);
});

//urls_new page get request code
app.get("/urls/new", (req, res) => {
  const templateVars = {
    guest: req.session.guest,
    users: Object.values(users)
  };
  if (!req.session.guest) {
    res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

//Make a new short url and store in database
app.post("/urls", (req, res) => {
  let randomId = generateRandomString();
  if (req.body.longURL.substring(0, 8) === "https://" || req.body.longURL.substring(0, 7) === "http://") {
    urlDatabase.push({id: randomId, long: req.body.longURL, userID: req.session.guest});
  }
  let target_url = "/urls/" + randomId;
  res.redirect(target_url);
});

//urls_show page get request code, shows more info about a url
app.get("/urls/:id", (req, res) => {
  function urlsForUser(id) {
    let userURLS = [];
      urlDatabase.forEach(function (x) {
        if (x.id === id) {
        userURLS.push(x);
      }
    });
    return userURLS;
  }
  let userURLNEW = urlsForUser(req.params.id);
  //function used to determine if a url starts with an http(s)://
  console.log(userURLNEW)
  function isValidURL(urlArr) {
    for (let i of urlArr) {
      if (i === undefined || i.long === undefined ||
        (i.long.substring(0, 8) !== "https://" && i.long.substring(0, 7) !== "http://"))
      {
        return false;
      }
      else return true;
    }
  }
  if (isValidURL(userURLNEW) === false || isValidURL(userURLNEW) === undefined) {
    res.send("NOT A VALID URL!");
    return;
  }
  let templateVars = {
    shortURL: req.params.id,
    urls: userURLNEW,
    guest: req.session.guest,
    users: Object.values(users)
  };
  res.render("urls_show", templateVars);
});

//deleting a url from the database
app.post("/urls/:id/delete", (req, res) => {
  let urlCurrent = urlDatabase.find( x => x.id === req.params.id);
  if (urlCurrent.userID !== req.session.guest) {
    res.send("Not allowed!");
    return;
  }
  urlCurrent.long = null;
  urlCurrent.id = null;
  res.redirect("/urls");
});

//updating an existing url in the database
app.post("/urls/:id/update", (req, res) => {
  let urlCurrent = urlDatabase.find( x => x.id === req.params.id);
  if (urlCurrent.userID !== req.session.guest) {
    res.send("Not allowed!");
    return;
  }
  urlCurrent.long = req.body.updURL;
  res.redirect(`/urls/${urlCurrent.id}`);
});

//setting a shortened URL to an original long address
app.get("/u/:shortURL", (req, res) => {
  let id = req.params.shortURL;
  let longURL = urlDatabase.find( x => x.id === id).long;
  res.redirect(longURL);
});

//user registration page get request code
app.get("/register", (req, res) => {
  let templateVars = {
    guest: req.session.guest
    };
  res.render("urls_register", templateVars);
});

//user registration page post request code
app.post("/register", (req, res) => {
  const pass = req.body.password;
  const hashedP = bcrypt.hashSync(pass, 10);
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
    password : hashedP
  };
  res.redirect("/login");
});

//user login page get request code
app.get("/login", (req, res) => {
  let templateVars = {
    guest: req.session.guest
  };
  res.render("urls_login", templateVars);
});

//user login page post request code
app.post("/login", (req,res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Empty email or password fields.');
    return;
  }
  const userDB = Object.values(users);
  const userBeing = userDB.find(x => x.email === req.body.email);
  if (!userBeing) {
    res.status(403).send("That email is not in the directory");
    return;
  }
  if (bcrypt.compareSync(req.body.password, userBeing.password) === false) {
    res.send("Incorrect Password!");
    return;
  }
  req.session.guest = userBeing.id;
  res.redirect("/urls");
});

//user logout code
app.post("/logout", (req, res) => {
  delete req.session.guest;
  res.redirect("/urls");
});

//root page
app.get("/", (req, res) => {
  res.redirect("/urls");
});

//server initialisation
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
