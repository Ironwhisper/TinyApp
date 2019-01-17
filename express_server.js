const express = require("express");
const app = express();
const PORT = 8080;

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

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
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