const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  if(req.body.username && req.body.password){
    if(!users.find(user => user.username === req.body.username)){
      users.push({username: req.body.username , password: req.body.password});
      return res.status(200).json({message: "User Registered Successfully: " + req.body.username});
    }else{
      return res.status(400).json({message: "User already exists: " + req.body.username});
    }
  }else{
    return res.status(400).json({message: "Missing Username / Password"});
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try{
    //Sin axios por recursion infinita y tambien se envia el objeto books directamente. ya que el.json ya lo comvierte a json no es necesario el JSON.stringify(books)
    return res.status(200).json(books);
  }catch (error){
      return res.status(500).json({
            message: "Error fetching books"
        });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;
    const book = allBooks[req.params.isbn];

    if (book) {
      return res.status(200).json(book);
    }

    return res.status(404).json({
      message: "Book not found"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error fetching books"
    });

  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {

  try {

    const response = await axios.get('http://localhost:5000/');

    const allBooks = response.data;

    const filteredBooks = Object.values(allBooks).filter(
      book => book.author === req.params.author
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    }

    return res.status(404).json({
      message: "Book not found by Author"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error fetching books"
    });

  }

});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {

  try {
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;
    const filteredBooks = Object.values(allBooks).filter(book => book.title === req.params.title);

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    }

    return res.status(404).json({
      message: "Book not found by Title"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error fetching books"
    });

  }

});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;
    const book = allBooks[req.params.isbn];

    if (book) {
      return res.status(200).json(book.reviews);
    }

    return res.status(404).json({
      message: "Book not found"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error fetching books"
    });

  }

});
module.exports.general = public_users;
