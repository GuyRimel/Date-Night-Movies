// IMPORTS //////////
const
  express = require('express'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  Models = require('models/models.js'),
  morgan = require('morgan'),
  path = require('path'),
  uuid = require('uuid');


// IMPORT REFS //////////
const app = express();


// MIDDLEWARE //////////
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


// BODY-PARSER //////////
// use body-parser module for request bodies (containing JSON)
app.use(bodyParser.json());

// use body-parser to parse url encoded content from the response body (extends to all data types)
app.use(bodyParser.urlencoded({ extended: true }));


// MONGOOSE //////////
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/DNMovies', {
useNewUrlParser: true, useUnifiedTopology: true
});


// ENDPOINTS //////////
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
app.get('/movies', (req, res) => {
  res.json(moviesList);
});

// Returns a JSON object of a single movie
app.get('/movies/:title', (req, res) => {
  res.json(moviesList.find((movie) => {
    return movie.title === req.params.title;
  }));
});

// Returns a JSON object of all movies of a certain genre
app.get('/movies/genres/:genre', (req, res) => {
  let responseText = 'Returns a JSON object of all movies of a certain genre';
  res.send(responseText);
});

// Returns a JSON object of a movie-director by name
app.get('/directors/:name', (req, res) => {
  let responseText = 'Returns a JSON object of a movie-director by name';
  res.send(responseText);
});

// Creates a new user, then gives acknowledgement
app.post('/users', (req, res) => {
  let newUser = req.body;
  
  if(!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    usersList.push(newUser);
    res.status(201).send(newUser);
  }
});

// Updates the username of a user, then gives acknowledgement
app.put('/users/:id/:username', (req, res) => {
  let responseText = `Updates the username of a user, then gives acknowledgement`;
  res.send(responseText);
});

// Adds a movie to a user's list of "favorites", then gives an acknowledgement
app.post('/users/:id/:title', (req, res) => {
  let responseText = `Adds a movie to a user's list of "favorites", then gives an acknowledgement`;
  res.send(responseText);
});

// Removes a movie from a user's list of favorites, then gives an acknowledgement
app.delete('/users/:id/:title', (req, res) => {
  let responseText = `Removes a movie from a user's list of favorites, then gives an acknowledgement`;
  res.send(responseText);
});

// Removes an existing user from the database by user id
app.delete('/users/:id', (req, res) => {
  let user = usersList.find((user) => {
    return user.id === req.params.id;
  });

  if(!user) {
    let responseText = `Removes an existing user from the database by user id`;
    res.send(responseText);
  } else {
    usersList = usersList.filter((obj) => obj.id !== req.params.id);
    res.status(201).send(`User ${req.params.id} was deleted.`)
  }
});


///// ERROR HANDLING
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('ERROR! ERROR! ERROR!');
});

app.listen(8080, () => console.log('App listening on port 8080.'));