const express = require("express");
const app = express();
const PORT = 8080;const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")

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


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("Ok");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase
  };
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});