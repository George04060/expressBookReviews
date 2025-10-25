const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) {
      return res.send("Username and password are required");
    }
    
    if (isValid(username)) {
      return res.send("User already exists");
    }
    
    users.push({ username: username, password: password });
    return res.send("User successfully registered");
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const booksList = await new Promise((resolve) => {
        resolve(books);
      });
      return res.send(JSON.stringify(booksList, null, 4));
    } catch (error) {
      return res.send("Error retrieving books");
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = await new Promise((resolve, reject) => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject(new Error("Book not found"));
          }
        });
        return res.send(JSON.stringify(book, null, 4));
    } catch (error) {
      return res.send("Book not found");
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      const booksByAuthor = await new Promise((resolve) => {
        const bookKeys = Object.keys(books);
        const filteredBooks = [];
        
        for (let i = 0; i < bookKeys.length; i++) {
          const book = books[bookKeys[i]];
          if (book.author === author) {
            filteredBooks.push(book);
          }
        }
        resolve(filteredBooks);
      });
      
      if (booksByAuthor.length > 0) {
        return res.send(JSON.stringify(booksByAuthor, null, 4));
      } else {
        return res.send("No books found for this author");
      }
    } catch (error) {
      return res.send("Error retrieving books by author");
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
      const booksByTitle = await new Promise((resolve) => {
        const bookKeys = Object.keys(books);
        const filteredBooks = [];
        
        for (let i = 0; i < bookKeys.length; i++) {
          const book = books[bookKeys[i]];
          if (book.title === title) {
            filteredBooks.push(book);
          }
        }
        resolve(filteredBooks);
      });
      
      if (booksByTitle.length > 0) {
        return res.send(JSON.stringify(booksByTitle, null, 4));
      } else {
        return res.send("No books found for this title");
      }
    } catch (error) {
      return res.send("Error retrieving books by title");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book && book.reviews) {
      return res.send(JSON.stringify(book.reviews, null, 4));
    } else {
      return res.send("No reviews found for this book");
    }
});

module.exports.general = public_users;
