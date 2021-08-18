const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const { getUserByEmail, generateRandomString } = require('./helpers');
const { urlDatabase, userDatabase } = require('./data')

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
  maxAge: 1 * 60 * 60 * 1000
}));

/////////////////// GET endpoints ////////////////////
app.get('/', (req, res) => {
  res.redirect("/urls");
});

 // show datbase info as json objects
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// webpage to show all urls belonging to the user
app.get("/urls", (req,res) => {
  const templateVars = { 
    urls: urlDatabase, 
    user: userDatabase,
    id: req.session.user_id
  };
  if (!req.session.user_id) {
    res.redirect('/login');
  }
  res.render("urls_index", templateVars);
});

// webpage to show info of newly created URL
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: userDatabase,
    id: req.session.user_id
  };
  if (!req.session.user_id) {
    res.redirect("/login");
  };
  res.render("urls_new", templateVars);
});

// webpage for registering new user
app.get("/register", (req, res) => {
  const templateVars = {
    user: userDatabase,
    id: req.session.user_id
  };
  res.render("register", templateVars);
});

// webpage for redirecting users from shortURL to longURL
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else {
    return res.status(404).send('Sorry, I can\'t find that page.');
  }
});

// webpage for redirecting users from shortURL to longURL
app.get("/urls/:shortURL", (req, res) => {
  const thisURL = urlDatabase[req.params.shortURL];
  const myCookieID = req.session["user_id"];
  if (myCookieID === thisURL.userID) {
    const updatedURL = req.body.currentURL;
    thisURL.longURL = updatedURL;
    res.redirect('/urls');
  } else {
    return res.status(401).send("Sorry, you don't have access to that page!");
  }
})

// webpage rendered when user logs in
app.get("/login", (req, res) => {
  const templateVars = {
    user: userDatabase,
    id: req.session.user_id
  };
  res.render("login", templateVars);
})

/////////////// POST endpoints ////////////////////

app.post("/urls", (req, res) => {
  const short = generateRandomString();
  const long = req.body.longURL;
  const user = req.session.user_id;
  if (req.session.user_id) {
    urlDatabase[short] = { 
      longURL: long, 
      userID: user
    };
    return res.redirect(`/urls`);
  } else {
    return res.status(401).send('You are not authorized to edit this url');
  }
});

//this endpoint will delete a url from the database
app.post("/urls/:shortURL/delete", (req, res) => {
  const short = req.params.shortURL;
  const user = req.session.user_id;
  if (!user) {
    res.redirect('/urls');
  }
  if (urlDatabase[short].userID !== user) {
    res.redirect('/urls')
  }
  delete urlDatabase[short];
  res.redirect("/urls");
})

// this endpoint will create a new shortURL
app.post("/urls/:shortURL/id", (req, res) => {
  const short = req.params.shortURL;
  const newurl = req.body.newURL;
  urlDatabase[short].longURL = newurl;
  res.redirect("/urls");
})

app.get("/urls/:shortURL/edit", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
    user: userDatabase,
    id: req.session.user_id
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = urlDatabase[req.params.shortURL];
  const user = req.session["user_id"];
  if (user === shortURL.userID) {
    const newURL = req.body.newURL
    shortURL.longURL = newURL;
    res.redirect('/urls')
  } else {
    return res.redirect("You don't have permission to edit that URL");
  }
})

// logout endpoint
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
})

//register new user endpoint
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const password = req.body.password;
  const email = req.body.email;
  if (req.body.email === '' || req.body.password === '') {
    res.statusCode = 400;
    return res.redirect('/register');
  }
  if (getUserByEmail(userDatabase, email)) {
    res.statusCode = 400;
    return res.redirect('/register');
  } 
  if (userDatabase[id]) {
    return res.write('Sorry that username has been taken.');
  }
  userDatabase[id] = {
    id: id,
    email: email,
    password: password,
  };
  req.session.user_id = id;
  res.redirect('urls');
})

// login endpoint
app.post("/login", (req,res) => {
  const email = req.body.email;
  const user = getUserByEmail(userDatabase, email);
  const id = user.id;
  if (!req.body.email) {
    res.statusCode = 403;
    res.redirect('/login');
  } else if (req.body.password !== user.password) {
    res.statusCode = 403;
    res.redirect('/login');
  };
  req.session.user_id = id;
  res.redirect("/urls");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
})