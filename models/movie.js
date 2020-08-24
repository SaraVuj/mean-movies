const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
    plot: {
        type: String,
        required: true
    },
    genres: Array,
    runtime: Number,
    cast: Array,
    num_mflix_comments: Number,
    title: {
        type: String,
        required: true
    },
    countries: Array,
    released: Date,
    directors: Array,
    rated: String,
    awards: Object,
    lastupdated: {
        type: Date,
        default: Date.now
    },
    year: Number,
    imdb: Object,
    type: String,
    tomatoes: Object

});

const Movie = module.exports = mongoose.model("Movie", MovieSchema);

module.exports.getMovies = function(callback){
    Movie.find(callback);
}

module.exports.getMovieById = function(id, callback){
    Movie.find({_id: id}, callback);
}
