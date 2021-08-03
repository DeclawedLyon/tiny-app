const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')



const urlDatabase = {
  "b2xVn2": "https://www.youtube.com/channel/UCSJ4gkVC6NrvII8umztf0Ow",
  "9sm5xK": "http://www.google.com"
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

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });
app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
})
app.get("/urls", (req,res) => {
  const templateVars = { urls: urlDatabase };
  res.render ("urls_index", templateVars);
})
app.get('/urls/new', (req, res) => {
  res.render("urls_new");
})
app.post("/urls", (req, res) => {
  const short = 'xyzzyx'//generateRandomString();
  const long = req.body.longURL;
  const newObject = {};
  if (!newObject[short]) {
    newObject[short] = long;
  }
  if(!urlDatabase[short]) {
    urlDatabase[short] = long;
  }
  // console.log(urlDatabase);
  res.redirect(`/urls/:${short}`);         // Respond with 'Ok' (we will replace this)
});
app.get("/u/:shortURL", (req, res) => {
  const short =  'xyzzyx'//(req.params.shortURL).toString();
  console.log(typeof short);
  console.log(short);
  console.log("the shortURL is: ",short)
  console.log(urlDatabase);
  console.log("the long URL should be: ",urlDatabase[short]);

  const longURL = urlDatabase[short];
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]/* What goes here? */ };
  res.render("urls_show", templateVars);
  // res.send(req.params);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
})