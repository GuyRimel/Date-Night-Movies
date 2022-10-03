// IMPORTS //////////
const
  express = require('express'),
  app = express(),
  { check, validationResult } = require('express-validator'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  morgan = require('morgan'),
  path = require('path'),
  uuid = require('uuid');


// MIDDLEWARE //////////
// BODY-PARSER //////////
// use body-parser module for request bodies (containing JSON)
app.use(bodyParser.json());

// use body-parser to parse url encoded content from the response body (extends to all data types)
app.use(bodyParser.urlencoded({ extended: true }));


// MORGAN //////////
// accessLogStream uses the fs and path modules to append 'log.txt'
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'log.txt'), {flags: 'a'});

// morgan pkg logs a timestamp to 'log.txt'
app.use(morgan('common', {stream: accessLogStream}));

// responses to requests for static content will serve from 'public' folder
// this will allow the html page to automatically link with its CSS, and JS in the
// public folder
app.use(express.static('public'));


// MONGOOSE //////////
// 'Movies' and 'Users' are mongoose models are exposed in 'models.js'
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/DNMovies', {
  useNewUrlParser: true, useUnifiedTopology: true
});


// CORS //////////
// allow for cross-origin resource sharing eg. accepting requests from  the frontend
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1) { // if the origin isn't found in allowedOrigins
      let message = 'The CORS policy for this application does not allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));


// AUTHENTICATION //////////
let auth = require('./auth')(app);


// PASSPORT //////////
const passport = require('passport');
require('./passport');


// ENDPOINTS //////////
// a sort of "greeting page" to give feedback on the correct port
app.get('/', (req, res) => {
  let responseText = '<h1>Welcome to Date Night Movies API!</h1>';
  responseText += `
  <p>Be sure to use REST API software like "Postman" to make requests.</p>
  <p>Click <a href="/documentation">HERE</a> for the API documentation.</p>`;
  res.send(responseText);
});

// serve a static documentation.html page
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

// returns a JSON object of ALL movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Error: ' + err);
    })
});

// Returns a JSON object of a single movie
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch ((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
    })
});

// Returns a JSON object of all movies of a certain genre
app.get('/movies/genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ "Genre.Name": req.params.Genre })
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Error: ' + err);
    })
});

// Returns the description of a Genre (of the first one found)
app.get('/genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.Genre })
    .then((movie) => {
      res.send(movie.Genre.Description);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Error: ' + err);
    })
});

// Returns a JSON object of a movie-director by name
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ "Director.Name": req.params.Name })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Returns a JSON object of one user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch ((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
    })
});

// Creates a new user // expects a JSON in the request body
app.post('/users', (req, res) => {
  let hashedPassword = Users.hashedPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if(user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) => { res.status(201).json(user) })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        })
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Updates the information of a user by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set: {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }) // the *updated (new) document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Adds a movie to a user's list of favorite movies
app.put('/users/:Username/movies/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $addToSet: { FavoriteMovies: req.params._id } // $addToSet won't add duplicates (note: if there IS a duplicate, it won't throw an error either...)
  },
  { new: true })  // the *updated (new) document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Removes a movie from a user's list of favorite movies
app.delete('/users/:Username/movies/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params._id }
  },
  { new: true })  // the *updated (new) document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Deletes an existing user from the database by user Username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if(!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' has been obliterated');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


///// ERROR HANDLING //////////
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('ERROR! ERROR! ERROR! ... ' + err);
});

app.listen(8080, () => console.log('App listening on port 8080.'));
