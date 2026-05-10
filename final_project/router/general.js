const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  if(req.body.username && req.body.password){
    if(!users.find(user => user.username === req.body.username)){
      users.push({username: req.body.username , password: req.body.password});
      return res.status(200).json({message: "User Registered Successfully: " + req.body.username});
    }else{
      return res.status(400).json({message: "User already exist: " + req.body.username});
    }
  }else{
    return res.status(400).json({message: "Missing Username / Password"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book_isbn = books[req.params.isbn]
  return res.send(JSON.stringify(book_isbn));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author_params = req.params.author;
  const exist_book = Object.values(books).filter(book => book.author === author_params)
  if(exist_book){
    return res.send(exist_book);
  }else{
    return res.status(404).json({message: "Book not found by Author"});
  }  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title_params = req.params.title;
  const exist_book = Object.values(books).filter(book => book.title === title_params)
  if(exist_book){
    return res.send(exist_book);
  }else{
    return res.status(404).json({message: "Book not found by Title"});
  }  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book_isbn = req.params.isbn;
  const exist_reviews = books[book_isbn].reviews;
  if(exist_reviews){
    return res.send(exist_reviews);
  }else{
    return res.status(404).json({message: "Reviews not found by ISBN"});
  } 
});

module.exports.general = public_users;
