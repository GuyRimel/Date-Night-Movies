const
  express = require('express'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  morgan = require('morgan'),
  path = require('path'),
  uuid = require('uuid');

const app = express();

// some test data
let moviesList = [
  { title: "Godzilla", genre: "Big Lizards" },
  { title: "Movie Title 2" },
  { title: "Movie Title 3" },
  { title: "Movie Title 4" },
  { title: "Movie Title 5" },
  { title: "Movie Title 6" },
  { title: "Movie Title 7" },
  { title: "Movie Title 8" },
  { title: "Movie Title 9" },
  { title: "Movie Title 10" }
];

let usersList = [
  {
    name: "John Smith",
    username: "JDawg",
    id: "",
    favorites: []
  }
]

// accessLogStream uses the fs and path modules to append 'log.txt'
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'log.txt'), {flags: 'a'});


///// MIDDLEWARE
// morgan pkg logs a timestamp to 'log.txt'
app.use(morgan('common', {stream: accessLogStream}));

// responses to requests for static content will serve from 'public' folder
// this apparently will allow the html page to automatically link with its CSS, and JS in the
// public folder
app.use(express.static('public'));

// uses body-parser module for request bodies (containing JSON)
app.use(bodyParser.json());

///// ENDPOINTS
// like a generic homepage
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
app.get('/movies/:genre', (req, res) => {
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
app.get('/users/:username', (req, res) => {
  let responseText = `Updates the username of a user, then gives acknowledgement`;
  res.send(responseText);
});

// Adds a movie to a user's list of "favorites", then gives an acknowledgement
app.get('/users/favorites', (req, res) => {
  let responseText = `Adds a movie to a user's list of "favorites", then gives an acknowledgement`;
  res.send(responseText);
});

// Removes a movie from a user's list of favorites, then gives an acknowledgement
app.get('/users/favorites/:title', (req, res) => {
  let responseText = `Removes a movie from a user's list of favorites, then gives an acknowledgement`;
  res.send(responseText);
});

// Removes an existing user from the database by userID
app.delete('/users/:id', (req, res) => {
  let user = usersList.find((user) => {
    return user.id === req.params.id;
  });

  if(user) {
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