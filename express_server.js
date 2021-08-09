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

const userDatabase = { 
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

const findUser = (database, email) => {
  for (const user in database) {
    if (email === database[user].email) {
      return database[user];
    }
  }
  return undefined;
};

app.get('/', (req, res) => {
  res.send("Hello!");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
})

app.get("/urls", (req,res) => {
  const templateVars = { 
    urls: urlDatabase, 
    user: userDatabase,
    id: req.cookies.user_id
  };
  res.render ("urls_index", templateVars);
})

app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: userDatabase,
    id: req.cookies.user_id
  };
  res.render("urls_new", templateVars);
})

app.get("/register", (req, res) => {
  const templateVars = {
    user: userDatabase,
    id: req.cookies.user_id
  };
  res.render("register", templateVars)
})

app.get("/u/:shortURL", (req, res) => {
  const short =  req.params.shortURL
  const longURL = urlDatabase[short];
  res.redirect(`${longURL}`);
});

app.get("urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
    user: userDatabase,
    id: req.cookies.user_id
  };
  res.render("urls_show", templateVars);
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

app.post("/urls/:shortURL/delete", (req, res) => {
  const short = req.params.shortURL
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
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
    newURL: req.params.newurl, 
    user: userDatabase,
    id: req.cookies.user_id
  };
  res.render("urls_show", templateVars);
})

app.post("/login", (req, res) => {
  res.cookie("user", req.body.username);
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
})


app.post("/register", (req, res) => {
  const id = generateRandomString();
  const password = req.body.password;
  const email = req.body.email;
  if (req.body.email === '' || req.body.password === '') {
    res.statusCode = 400;
    res.redirect('/oops');
  } else if (findUser(userDatabase, email)) {
    res.statusCode = 400;
    res.redirect('/oops');
  } else if (!userDatabase[id]) {
    userDatabase[id] = {
      id: id,
      email: email,
      password: password
      };
  } else{
    res.write("Sorry that username has been taken.");
  }
  res.cookie("user_id", id);
  res.redirect("urls")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
})