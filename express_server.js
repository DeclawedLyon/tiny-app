const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());



const urlDatabase = {
  b2xVn2: "https://www.youtube.com/channel/UCSJ4gkVC6NrvII8umztf0Ow",
  fsm5xK: "http://www.google.com"
}

function generateRandomString() {
  const alphaNumeric = ["a", 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    let randomInt = Math.floor(Math.random() * 36);
    // console.log(alphaNumeric[randomInt])
    randomString += alphaNumeric[randomInt];
  }
  // console.log(randomString);
  return randomString;
}

app.get('/', (req, res) => {
  res.send("Hello!");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
})

app.get("/urls", (req,res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies.username};
  res.render ("urls_index", templateVars);
})

app.get('/urls/new', (req, res) => {
  const templateVars = {username: req.cookies.username};

  res.render("urls_new");
})

app.post("/urls", (req, res) => {
  const short = generateRandomString();
  const long = req.body.longURL;
  const newObject = {};
  if (!newObject[short]) {
    newObject[short] = long;
  }
  if(!urlDatabase[short]) {
    urlDatabase[short] = long;
  }
  res.redirect(`/urls/${short}`);
});

app.get("/u/:shortURL", (req, res) => {
  const short =  req.params.shortURL//.slice(1);
  // console.log(typeof short);
  // console.log(short);
  // console.log("the req paramaters: ",req.params.shortURL)
  // console.log("the shortURL is: ",short)
  // console.log(urlDatabase);
  // console.log("the long URL should be: ",urlDatabase[short]);
  const longURL = urlDatabase[short];
  // console.log("longURL: ", longURL)
  res.redirect(`${longURL}`);
});

app.get("urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies.username/* What goes here? */ };
  res.render("urls_show", templateVars);
  // res.send(req.params);
})

app.post("/urls/:shortURL/delete", (req, res) => {
  const short = req.params.shortURL
  // console.log(short)
  delete urlDatabase[short];
  res.redirect("/urls");
})

app.post("/urls/:shortURL/id", (req, res) => {
  const short = req.params.shortURL;
  const newurl = req.body.newURL;
  urlDatabase[short] = newurl;
  res.redirect("/urls");
})

app.post("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], newURL: req.params.newurl, username: req.cookies.username};
  res.render("urls_show", templateVars);
})

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  console.log(req.cookies.username);
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  const templateVars = { urls: urlDatabase, username: null }
  // req.cookies.username = null;
  res.redirect("/urls");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
})