const
  express = require('express'),
  fs = require('fs'),
  path = require('path'),
  morgan = require('morgan');

const app = express();

let top10Movies = [
  { title: "Generic Movie Title" },
  { title: "Generic Movie Title" },
  { title: "Generic Movie Title" },
  { title: "Generic Movie Title" },
  { title: "Generic Movie Title" },
  { title: "Generic Movie Title" },
  { title: "Generic Movie Title" },
  { title: "Generic Movie Title" },
  { title: "Generic Movie Title" },
  { title: "Generic Movie Title" }
];

Object.keys(top10Movies).forEach( (key) => console.log(top10Movies[key]))

// accessLogStream uses the fs module method "createWriteStream" to append 'log.txt'
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'log.txt'), {flags: 'a'});

// morgan (pkg) logs a timestamp to the 'log.txt' file as per accessLogStream
app.use(morgan('combined', {stream: accessLogStream}));

// serve a static documentation.html page
app.use(express.static('public/documentation.html'));

// defining routes
app.get('/', (req, res) => {
  let responseText = '<h1>Welcome to this amorphous blob!</h1>';
  responseText += '<br><p>Soon this will be an API for Date-Night-Movies :D</p>';
  res.send(responseText);
});

app.get('/secret', (req, res) => {
  res.send('This is a super secret URL. O_O!');
});

app.get('/movies'), (req, res) => {
  res.json(top10Movies);
}

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('ERROR!');
});

app.listen(8080, () => console.log('App listening on port 8080.'));