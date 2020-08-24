const express = require('express');
const router = express.Router();
const passport = require('passport');
const Comment = require('../models/comment');

///api/comments?movie_id=573a1390f29313caabcd41b1
router.get('/', passport.authenticate('jwt', {session:false}), (req, res) => {
    Comment.getCommentsForMovieId(req.query.movie_id, (err, comments) => {
        if (err) throw err;
        res.json(comments);
    });
});

router.post('/', passport.authenticate('jwt', {session:false}), (req, res) => {
    newComment = new Comment();
    newComment.movie_id = req.body.movie_id;
    newComment.name = req.body.name;
    newComment.email = req.body.email;
    newComment.text = req.body.text;

    Comment.addComment(newComment, (err, msg) =>{
        if(err) res.json({success: false, msg: 'Comment cannot be added'});
        else res.json({success: true, msg: msg});
    });
});

router.put('/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
    Comment.updateComment(req.params.id, req.body, (err, msg) => {
        if(err) res.json({success: false, msg: 'Comment cannot be updated'});
        else res.json({success: true, msg: msg});
    });
});

router.delete('/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
    Comment.deleteComment(req.params.id, (err, msg) => {
        if(err) res.json({success: false, msg: 'Comment cannot be deleted'});
        else res.json({success: true, msg: msg});
    });
});

module.exports = router;
