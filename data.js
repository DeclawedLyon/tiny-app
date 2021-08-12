const urlDatabase = {
  b2xVn2: { 
    longURL: "https://www.youtube.com/channel/UCSJ4gkVC6NrvII8umztf0Ow",
    userID: "userRandomID"
  },
  fsm5xK: {
   longURL: "http://www.google.com",
   userID: "user2RandomID"
  },
  aid92j: {
    longURL: "www.lighthouselabs.com",
    userID: "testUser"
  }
};
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
  },
  "testUser": {
    id: "testUser",
    email: "a@a.com",
    password: "dwq"
  }
};

module.exports = {
  urlDatabase,
  userDatabase
}