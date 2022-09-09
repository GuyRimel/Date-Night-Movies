const
  express = require('express'),
  fs = require('fs'),
  path = require('path'),
  morgan = require('morgan'),
  app = express();

// some test data
let top10Movies = [
  { title: "Movie Title 1" },
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

// accessLogStream uses the fs module method "createWriteStream" to append 'log.txt'
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'log.txt'), {flags: 'a'});

// morgan (pkg) logs a timestamp to the 'log.txt' file as per accessLogStream
app.use(morgan('common', {stream: accessLogStream}));

// responses to requests for static content will serve from 'public'
// this apparently will allow the html page to automatically link
// to its link tags (CSS, and JS in the same folder)
app.use(express.static('public'));

// defining routes
app.get('/', (req, res) => {
  let responseText = '<h1>Welcome to this amorphous blob!</h1>';
  responseText += '<br><p>Soon this will be an API for Date-Night-Movies :D</p>';
  res.send(responseText);
});

// serve a static documentation.html page
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/secret', (req, res) => {
  res.send('This is a super secret URL. O_O!');
});

app.get('/movies', (req, res) => {
  res.json(top10Movies);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('ERROR!');
});

app.listen(8080, () => console.log('App listening on port 8080.'));