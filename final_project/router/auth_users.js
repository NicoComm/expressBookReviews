const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username:'jhon',
    password:'1234'
  },
];

const isValid = (username)=>{ //returns boolean
  const valid_user = users.find(user => user.username === username);
  if(valid_user){
    return true;
  }else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const valid_user = users.find(user => user.username === username && user.password === password);
  if(valid_user){
    return true;
  }else{
    return false;
  }
}

regd_users.post("/login", (req,res) => {

  if(req.body.username && req.body.password){

    if(isValid(req.body.username)){

      if(authenticatedUser(req.body.username, req.body.password)){

        const accessToken = jwt.sign({data:req.body.password},'access',{expiresIn: 60});

        req.session.authorization = {accessToken,session_username: req.body.username};

        return res.status(200).json({
          message: "Login successful"
        });

      } else {
        return res.status(400).json({
          message: "Invalid Credentials"
        });
      }

    } else {
      return res.status(400).json({
        message: "Invalid Username"
      });
    }

  } else {
    return res.status(400).json({
      message: "Missing Username / Password"
    });
  }

});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if(req.session.authorization){
    const book = books[req.params.isbn]
    if(book){    
      const user = req.session.authorization.session_username;
      book.reviews[user] = req.query.review;
      return res.status(200).json({
                message: "Review added successfully",
                reviews: req.query.review
      });
    }else{
      return res.status(404).json({message: "Book no found"});
    }
  }
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  if(req.session.authorization){
    const book = books[req.params.isbn]
    if(book){    
      const user = req.session.authorization.session_username;
      delete book.reviews[user];

      return res.status(200).json({
                message: "Review deleted successfully",
      });
    }else{
      return res.status(404).json({message: "Book no found"});
    }
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
