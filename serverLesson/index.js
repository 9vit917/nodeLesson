const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const articles = require('./readAll');

const JSONpath = './articles.json';

const handlers = {
    '/api/articles/readall': articles.readAll,
    '/api/articles/read': articles.readArticle,
    '/api/articles/update': updateArticle,
    '/api/articles/delete': deleteArticle,
    '/api/comments/create': createArticle,
    '/api/comments/delete': deleteComment
};

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
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    })
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function createArticle(req, res, payload, cb) {
  let keys = Object.keys(payload);

  if(!keys.find((el)=> {return el === 'text'})) throw 'Data is not valid';

  let newArticle = {
    "id": `f${(~~(Math.random()*1e8)).toString(16)}`,
    'title' : '',
    'text' : '',
    'date' : '',
    'author' : '',
    'comments' : []
  }

  if(!keys.find((el)=> {return el === 'articleId'})) {
    keys.forEach(element => {
      if(newArticle.hasOwnProperty(element)){
        newArticle[element] = payload[element];
      }
    });
    saveJson(newArticle, 'article', () => {
      cb(null, newArticle);
    })
  } else {
    createComment(payload, cb)
  }
}

function saveJson (newData, type, callback) {
  fs.readFile(JSONpath, function (err, data) {
    if(err) throw err;
    var json = JSON.parse(data);
    switch (type) {
      case 'article': {
        json.articles.push(newData);
      }
      case 'comment': {
        let index = json.articles.map((el)=>{return el.id}).indexOf(newData.articleId);
        if(!index) throw 'Wrong id';
        json.articles[index].comments.push(newData);
      }
    }
    fs.writeFile(JSONpath, JSON.stringify(json), 'utf8', (err, res) => {
      if (err) throw err;
      if(!!callback) callback.call();
    })
  })
}

function createComment(payload, cb) {
  let keys = Object.keys(payload);
  let newComment = {
    "id": `f${(~~(Math.random()*1e8)).toString(16)}`,
    'text' : '',
    'date' : '',
    'author' : '',
    'articleId' : ''
  }
  keys.forEach(element => {
    if(newComment.hasOwnProperty(element)){
      newComment[element] = payload[element];
    }
  });
  saveJson(newComment, 'comment', () => {
    cb(null, newComment);
  })
}

function deleteArticle(req, res, payload, cb) {
  let myData = articles.getAllArticles();
  myData.articles =  myData.articles.filter((el) => {
    return el.id !== payload.id;
  })
  fs.writeFile(JSONpath, JSON.stringify(myData), 'utf8', (err, res) => {
    if (err) throw err;
    cb(null, `Article - ${payload.id}, was delited`)
  })
}

function deleteComment(req, res, payload, cb) {
  let myData = articles.getAllArticles();
  let commentForDelete = myData.articles.map((el)=>{return el.comments}).flat().filter((el)=>{return el.id === payload.id;})[0];
  let index = myData.articles.map((el)=>{return el.id}).indexOf(commentForDelete.articleId);
  console.log(index)
  console.log(commentForDelete)
  console.log(myData.articles.map((el)=>{return el.id}))
  myData.articles[index].comments =  myData.articles[index].comments.filter((el) => {
    return el.id !== commentForDelete.id;
  })
  fs.writeFile(JSONpath, JSON.stringify(myData), 'utf8', (err, res) => {
    if (err) throw err;
    cb(null, `Comment - ${payload.id}, was delited`)
  })
}

function updateArticle(req, res, payload, cb) {
  let myData = articles.getAllArticles()
  let fieldsForUpdates = ['title','text','author']
  let index = myData.articles.map((el)=>{return el.id}).indexOf(payload.id);
  let keys = Object.keys(payload);
  keys.forEach(element => {
    if(fieldsForUpdates.indexOf(element) !== -1) {
      myData.articles[index][element] = payload[element];
    }
  });
  fs.writeFile(JSONpath, JSON.stringify(myData), 'utf8', (err, res) => {
    if (err) throw err;
    cb(null, `Article - ${payload.id}, was updated`)
  })
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
