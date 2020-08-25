const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)

const config = require('./config/db');
const store = new MongoDBStore({
    uri: config.database,
    collection: 'sessions'
});
   
  // Catch errors
store.on('error', function(error) {
    console.log(error);
});

mongoose.connect(config.database)
mongoose.connection.on('connected', () => {
    console.log(`Connected to database ${config.database}`);
});

mongoose.connection.on('error', (err) => {
    console.log(`Connected to database ${err}`);
});

const app = express();
const port = 5000;
app.use(express.json());

app.use(session({ 
  
    // It holds the secret key for session 
    secret: 'jflkqfuhqlfbqlifbL', 
  
    // Forces the session to be saved 
    // back to the session store 
    resave: false, 
  
    // Forces a session that is "uninitialized" 
    // to be saved to the store 
    saveUninitialized: false,
    store: store
}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

const users = require('./routes/users');
const movies = require('./routes/movies');
const comments = require('./routes/comments');

app.use('/api/users', users);
app.use('/api/movies', movies);
app.use('/api/comments', comments);

app.get('/', (req, res) => {
    res.send('HOME PAGE');
});
app.listen(port, () => console.log(`Server started on port ${port}`));