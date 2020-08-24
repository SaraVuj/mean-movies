const express = require('express');
const router = express.Router();
const passport = require('passport');
const Movie = require('../models/movie');

router.get('/', passport.authenticate('jwt', {session:false}), (req, res) => {
    Movie.getMovies((err, movies) => {
        if (err) throw err;
        res.json(movies);
    });
});

module.exports = router;