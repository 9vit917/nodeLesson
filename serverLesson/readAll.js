const JSONpath = './articles.json';

const fs = require('fs');


let json = {}

fs.readFile(JSONpath, (err, data) => {
    if (err) {
        throw err;
    } else {
        json = JSON.parse(data);
    }
})

function getAllArticles(req, res, payload, cb) {
    cb(null, json);
}

function getArticle(req, res, payload, cb){
    let article = json.articles.filter((el) => {
        return el.id === payload.id;
    })
    cb(null, article);
}


module.exports.getAllArticles = json;
module.exports.readAll = getAllArticles;
module.exports.readArticle = getArticle;