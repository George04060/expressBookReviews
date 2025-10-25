const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

function generateAccessToken(username) {
    return jwt.sign({data: username }, "access", {expiresIn: "1h" });
}
const isValid = (username)=>{ //returns boolean
    return users.filter(user => user.username === username).length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.filter(user => user.username === username && user.password === password).length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (authenticatedUser(username, password)) {
        let accessToken = generateAccessToken(username);
        req.session.authorization = { accessToken };
        return res.send("User successfully logged in");
    } else {
        return res.send("Invalid Login. Check username and password");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.data;
    
    if (!review) {
      return res.send("Review is required");
    }
    
    if (!books[isbn]) {
      return res.send("Book not found");
    }
    
    books[isbn].reviews[username] = review;
    return res.send("Review added/modified successfully");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
