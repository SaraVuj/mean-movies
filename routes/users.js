const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config/db');
const User = require('../models/user');

const nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport(config.mailer.options);

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get("/auth/facebook/callback", passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/error"
    })
);

router.post('/register', (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg:'Failed to register user'});
        }
        else{
            res.json({success:true, msg:'User registered'});
        }
    });
});

router.post('/authenticate', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail(email, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800
                });

                res.json({
                    success: true,
                    token: token,
                    user:{
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                });
            } else{
                return res.json({success: false, msg: 'Passwords don\'t match'});
            }
        });
    });
});

// router.get('/profile/:id', /*passport.authenticate('jwt', {session:false}),*/ (req, res) => {
//     User.getUserById(req.params.id, (err, user) => {
//         if(err) throw err;
//         res.json(user);
//     });
    
// });

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res) => {
    res.json({user: req.user});
    
});

router.post('/forgotpassword', (req, res) => {
    email = req.body.email;
    User.getUserByEmail(email, (err, user) => {
        if(err) throw err;
        if(!user) res.send("User with given email has not been registered.");
        if(user){
            let mailOptions = {
                to: user.email,
                from: config.mailer.from,
                subject: 'Password Reset',
                html: "<p>Nova lozinka</p>"
              };
              smtpTransport.sendMail(mailOptions,  (err) => {
                if (!err) {
                  res.send({
                    message: 'An email has been sent to the provided email with further instructions.'
                  });
                } else {
                    console.log(err);
                  return res.status(400).send({
                    message: 'Failure sending email'
                  });
                }
        
                done(err);
            });
        }
    });
});

module.exports = router;