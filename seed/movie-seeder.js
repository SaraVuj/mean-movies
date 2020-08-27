var Movie = require('../models/movie');
const mongoose = require('mongoose');
const config = require('../config/db');
const { exists } = require('../models/movie');

mongoose.connect(config.database);

var movies = [
    new Movie({
        title: "The Arrival of a Train",
        year: 1896,
        runtime: 1,
        poster: "http://ia.media-imdb.com/images/M/MV5BMjEyNDk5MDYzOV5BMl5BanBnXkFtZTgwNjIxMTEwMzE@._V1_SX300.jpg",
        plot: "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seencoming at some distance. When the train stops at the platform, ...",
        fullplot: `A group of people are standing in a straight line along
                    the platform of a railway station, waiting for a train, which is
                    seen coming at some distance. When the train stops at the platform,
                    the line dissolves. The doors of the railway-cars open, and people
                    on the platform help passengers to get off.`,
        lastupdated: "2015-08-15 00:02:53.443000000",
        type: "movie",
        directors: [
            "Auguste Lumière",
            "Louis Lumière"
        ],
        imdb: {
            rating: 7.3,
            votes: 5043,
            id: 12
        },
        countries: [
            "France"
        ],
        genres: [
            "Documentary",
            "Short"
        ],
      
        num_mflix_comments:  1
    })
];


var done = 0;
for (var i=0; i<movies.length; i++) {
    movies[i].save((err, res) => {
        done++;
        if(done === movies.length){
            exit();
        }
    });
    
   
}

function exit(){
    mongoose.disconnect();
}
