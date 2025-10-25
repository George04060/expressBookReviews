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
// public_users.get('/', function (req, res) {
//   return res.send(JSON.stringify(books, null, 4));
// });


// Get the book list using Axios with async/await (Task 10)
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   
//   if (book) {
//     return res.send(JSON.stringify(book, null, 4));
//   } else {
//     return res.send("Book not found");
//   }
// });


// Get book details using Axios with async/await (Task 11)
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found", error: error.message });
  }
});

  
// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const author = req.params.author;
//   const bookKeys = Object.keys(books);
//   const booksByAuthor = [];
//   
//   for (let i = 0; i < bookKeys.length; i++) {
//     const book = books[bookKeys[i]];
//     if (book.author === author) {
//       booksByAuthor.push(book);
//     }
//   }
//   
//   if (booksByAuthor.length > 0) {
//     return res.send(JSON.stringify(booksByAuthor, null, 4));
//   } else {
//     return res.send("No books found for this author");
//   }
// });


// Get book details using Axios with async/await (Task 12)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found for this author", error: error.message });
  }
});


// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   const title = req.params.title;
//   const bookKeys = Object.keys(books);
//   const booksByTitle = [];
//   
//   for (let i = 0; i < bookKeys.length; i++) {
//     const book = books[bookKeys[i]];
//     if (book.title === title) {
//       booksByTitle.push(book);
//     }
//   }
//   
//   if (booksByTitle.length > 0) {
//     return res.send(JSON.stringify(booksByTitle, null, 4));
//   } else {
//     return res.send("No books found for this title");
//   }
// });


// Get book details using Axios with async/await (Task 13)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found for this title", error: error.message });
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
