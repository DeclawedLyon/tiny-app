const { assert } = require('chai');

const { getUserByEmail } = require('../helpers');

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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com").id;
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput)
  });
  it("should return undefined if a user doesn't exist", function() {
    const user = getUserByEmail(testUsers, "randomuser@example.com");
    const expectedOutput = undefined;

    assert.equal(user, expectedOutput)
  });
  it('should return undefined if a users email does not exist', function() {
    const user = getUserByEmail(testUsers, "randomuser@example.com");
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput)
  });
});