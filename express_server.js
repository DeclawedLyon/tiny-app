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

app.get('/', (req, res) => {
  res.redirect("/urls");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req,res) => {
  const templateVars = { 
    urls: urlDatabase, 
    user: userDatabase,
    id: req.session.user_id
  };
  if (!req.session.user_id) {
    res.redirect('/login');
  }
  res.render ("urls_index", templateVars);
});

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

app.get("/register", (req, res) => {
  const templateVars = {
    user: userDatabase,
    id: req.session.user_id
  };
  res.render("register", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const short =  req.params.shortURL;
  const longURL = urlDatabase[short].longURL;
  console.log(urlDatabase[short].longURL)
  res.redirect(`${longURL}`);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[shortURL], 
    user: userDatabase,
    id: req.session.user_id
  };
  res.render("urls_show", templateVars);
})

app.get("/login", (req, res) => {
  const templateVars = {
    user: userDatabase,
    id: req.session.user_id
  };
  res.render("login", templateVars);
})

app.post("/urls", (req, res) => {
  const short = generateRandomString();
  const long = req.body.longURL;
  const newObject = {};
  const user = req.session.user_id;
  if(!user) {
    res.redirect('/login');
  }
  if (!newObject[short]) {
    newObject[short] = {
      longURL: long,
      userID: user
    };
  };
  if(!urlDatabase[short]) {
    urlDatabase[short] = {
      longURL: long,
      userID: user
    };
  };
  res.redirect(`/urls/${short}`);
});

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
    id: req.session.user_id
  };
  res.render("urls_show", templateVars);
})


app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
})

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