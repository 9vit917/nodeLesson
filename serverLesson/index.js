const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const handlers = {
    '/sum': sum,
    '/api/articles/readall': getAllArticles
};

let  myData= {};

const server = http.createServer((req, res) => {
  parseBodyJson(req, (err, payload) => {
    const handler = getHandler(req.url)
    handler(req, res, payload, (err, result) => {
        if(err) {
            res.statusCode = err.code;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(err));
            return
        }
        console.log(result);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    })
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  data = getJSONFile();
});

function sum(req, res, payload, cb) {
    const result = {
        c: payload.a + payload.b
    };

    cb(null, result);
}

function getAllArticles(req, res, payload, cb) {
  cb(null, data);
}

function getHandler(url) {
    return handlers[url] || notFound;
}

function notFound(req, res, payload, cb) {
    cb({
        code: 404,
        message: 'Not Found'
    });
}

function parseBodyJson(req, cb) {
  let body = [];

  req.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();

    let params = JSON.parse(body);

    cb(null, params);
  });
}

function getJSONFile() {
  fs.readFile('./articles.json', 'json', 'utf8', (err, data) => {
    if (err) throw err;
    else {
      data = JSON.parse(data);
    }
  })
  return require('./articles.json');
}
