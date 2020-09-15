const User = require('../models/user')
const Book = require('../models/book')
const jwt = require("jsonwebtoken");


exports.addBook = (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    const author = req.query.userId;

    const book = new Book({
        name: name,
        description: description,
        author: author,
    });
    book
      .save()
      .then(createdBook => {
        res.status(201).json({
            message: "book added successfully",
            book: {
                ...book,
                id: createdBook._id
            }
        });
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
            message: "failed to create a book!"+error
            
        });
    });
  };


  exports.getAllBooks = (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY , (err,data)=>{
      if(err){
        res.status(401).json({
          message:"forbiden"
        })
      }
      else{
        Book.find().populate('author').exec()
        .then(books => {
          console.log(books);
          res.status(200).json(books);
        })
        .catch(error => {
          res.status(500).json({
              message: "Fetching list of books failed!"
          });
      });
      }
    })
    
  };