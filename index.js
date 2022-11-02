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
  cors = require('cors'),
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

// use this block for LOCAL DB connection
// mongoose.connect('mongodb://localhost:27017/DNMovies', {
//   useNewUrlParser: true, useUnifiedTopology: true
// });

// use this block for REMOTE/HOSTED DB connection
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
})
.then( console.log('DB Connected') );


// CORS //////////
// cross-origin resource sharing eg. accepting requests from  the frontend
let allowedOrigins = ['http://localhost:1234'];
app.use(cors({
  allowedHeaders: ['Content-Type'],
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
  res.status(201).send(responseText);
});

// serve a static documentation.html page
app.get('/documentation', (req, res) => {
  res.status(201).sendFile('public/documentation.html', { root: __dirname });
});

// returns a JSON object of ALL movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Returns a JSON object of a single movie
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(201).json(movie);
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
      res.status(201).send(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Returns the description of a Genre (of the first one found)
app.get('/genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.Genre })
    .then((movie) => {
      res.status(201).send(movie.Genre.Description);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Returns a JSON object of a movie-director by name
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ "Director.Name": req.params.Name })
    .then((movie) => {
      res.status(201).json(movie.Director);
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
      res.status(201).json(user);
    })
    .catch ((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
    })
});

// Creates a new user // expects a JSON in the request body
app.post('/users',
  // validation array. 'check' refs to 'express-validator' pkg import
  [
    check('Username', 'Username length must be at least 5 characters.').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    // evaluate validations
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
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
        res.status(201).json(updatedUser);
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
    res.status(201).json(updatedUser);
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
    res.status(201).json(updatedUser);
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

// looks for port number preconfigured (by Heroku), OR uses 443
const port = process.env.PORT || 443;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
