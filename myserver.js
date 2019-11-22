// const http = require('http');

// http.createServer((req, res) => {
//     res.writeHead(200, {"Content-Type": "text/plain"});
//     res.end("Hello World\n");
// }).listen(8080);

// console.log('Server running on port 8080');
// const express = require('express'),
// app = express();

// app.use(express.static(__dirname + '/public'));

// app.listen(8080);


let Parser = require('./parser');

const fs = require('fs');

fs.readFile('./Test/example.txt', (err, data) => {
    if (err) throw err;

    let text = data.toString();
    let parser = new Parser();

    console.log(parser.parse(text));
})