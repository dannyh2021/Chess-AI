// grab necessary libraries
const http = require('http');
const fs = require('fs');

// web pages
const homePage = fs.readFileSync('index.html');
const notFoundPage = fs.readFileSync('notfound.html');

// create server
const server = http.createServer((req, res) => {
    if(req.url === '/')
        res.end(homePage);
    else {
        res.writeHead(404);
        res.end(notFoundPage);
    }
});

server.listen(3000);