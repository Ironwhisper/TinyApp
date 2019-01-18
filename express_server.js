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

//INDEX PAGE
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
    };
  res.render("urls_index", templateVars);
});

//URLS_NEW
app.get("/urls/new", (req, res) => {
  const templateVars = {
  username: req.cookies["username"],
};
  res.render("urls_new", templateVars);
});

//LOGIN
app.post("/login", (req, res) => {
  res.cookie("username", req.body.login)
  res.redirect("/urls");
});

//LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("username")
  // req.cookies.name
  res.redirect("urls");
})

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
    username: req.cookies["username"]
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
  res.redirect(longURL);
});

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