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

const getUserByEmail = (database, email) => {
  for (const user in database) {
    if (email === database[user].email) {
      return database[user];
    }
  }

  return undefined;
};
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
console.log("the value is:",getUserByEmail(testUsers, "randomuser@example.com"))
console.log(getUserByEmail(testUsers, "randomuser@example.com"))

module.exports = {
  getUserByEmail,
  generateRandomString
}