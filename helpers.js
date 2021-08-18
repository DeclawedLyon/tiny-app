const testUsers = {
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
};
// helper function to generate randomized id;
function generateRandomString() {
  const alphaNumeric = ["a", 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    let randomInt = Math.floor(Math.random() * 36);
    randomString += alphaNumeric[randomInt];
  }
  return randomString;
}
// helper function to get user object from database
const getUserByEmail = (database, email) => {
  for (const user in database) {
    if (email === database[user].email) {
      return database[user];
    }
  }
  return undefined;
};

module.exports = {
  getUserByEmail,
  generateRandomString
}