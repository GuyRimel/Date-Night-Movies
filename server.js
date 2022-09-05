const http = require("http"),
  url = require("url"),
  fs = require("fs");

http.createServer((request, response) => {
  let addr = request.url,
    q = url.parse(addr, true),
    filePath = '';

  fs.appendFile(
    `URL: ${addr}
    Timestamp: ${new Date()}
    
    `, (err) => {
      if(err) {
        console.log(err);
      } else {
        console.log('Added to log.');
      }
    }
  )

  if( q.pathName.includes('documentation') ) {
    filePath = (__dirname + 'documentation.html');
  } else {
    filePath = __dirname + 'index.html';
  }

  fs.readFile(filePath, (err, data) => {
    if(err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'txt/html' });
    response.write(data);
    response.end();

  });

}).listen(8080);
console.log("My first Node test server is running on Port 8080.");
