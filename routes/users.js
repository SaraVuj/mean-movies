const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');
const config = require('../config/db');
const {body, validationResult} = require('express-validator');
const User = require('../models/user');

const nodemailer = require('nodemailer');
const { route } = require('./movies');
var smtpTransport = nodemailer.createTransport(config.mailer.options);

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get("/auth/facebook/callback", passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/error"
    })
);

router.post('/register', [
    //validate email
    body('email').notEmpty().isEmail(),
    //validate password
    body('password').notEmpty().isLength({min:4})] , (req, res) => {

     //validation errors
     var errors = validationResult(req);
 
     if(!errors.isEmpty()){
        return res.status(400).json({errors: errors});
     }


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

    req.session.email = email;
    console.log(req.session.email);

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

router.get('/profile', passport.authenticate('jwt'), (req, res) => {
    console.log(req.sessionID);
    if(req.session.email) {
        res.json({user: req.user});
    }
    else res.json({msg: "not logged in"});
    
});

router.post('/forgotpassword', (req, res) => {
    email = req.body.email;
    User.getUserByEmail(email, (err, user) => {
        if(err) throw err;
        if(!user) res.send("User with given email has not been registered.");
        if(user){
            newPassword = crypto.randomBytes(5).toString('hex');
            console.log(`New password ${newPassword}`);

            User.generatePassword(newPassword, (err, hash) => {
                if(err) throw err;
                user.password = hash;
                User.updateUser(user._id, user, (err, msg) => {
                    if(err) throw err;
                    console.log(hash);
                })
            });


            let mailOptions = {
                to: user.email,
                from: config.mailer.from,
                subject: 'Password Reset',
                html: "<p>" + newPassword + "</p>"
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


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;