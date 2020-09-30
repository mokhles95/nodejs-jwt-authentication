const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const passport = require('passport');

exports.addUser = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 10, function(err, hash) {
      const user = new User({
        name: name,
        email: email,
        password:hash
    });
    user
      .save()
      .then(createdUser => {
        res.status(201).json({
            message: "user added successfully",
            user: {
                ...user,
                id: createdUser._id
            }
        });
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
            message: "failed to create a user!"+error
            
        });
    });
    });
   
  };

  exports.loginWithPassport=(req,res,next)=>{
    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if(err) {
        return next(err);
      }
  
      if(passportUser) {
        console.log(passportUser);
        
        const user = passportUser;
                    const token = jwt.sign(
                {
                  email: passportUser.email,
                  userId: passportUser._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
              );
        user.token = token
  
    return res.status(200).json({
        firstName: passportUser.firstName,
        lastName: passportUser.lastName,
        email: passportUser.email,
        token : token
                     });
      }
  
      return res.status(400).json(info);
    })(req, res, next);
    
  }



  exports.login = (req, res, next) => {
    console.log(process.env.JWT_KEY);
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
   
  };

  
  exports.ensureToken = (req,res,next)=>{
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== 'undefined'){
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    }
    else{
      res.status(401).json({
        message: "token failed"
      });
    }
  }