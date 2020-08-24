const mongoose = require('mongoose');
const Movie = require('./movie');

const CommentSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    movie_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'Movie'
    },
    text:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const Comment = module.exports = mongoose.model("Comment", CommentSchema);

module.exports.getCommentsForMovieId = function(movie_id, callback){
    Comment.find({movie_id: movie_id}, callback);
}

module.exports.addComment = function(comment, callback){
    Movie.getMovieById(comment.movie_id, (err, movie) => {
        if (movie) {
            comment.save(callback);
        }
    });
}

module.exports.updateComment = function(id, comment, callback){
    Comment.updateOne({_id: id}, comment, callback);
}

module.exports.deleteComment = function(id, callback){
    Comment.deleteOne({_id: id}, callback);
}
