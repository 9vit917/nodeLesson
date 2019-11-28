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

function getArticlesWithParametrs(data, cb) {
    let articles = [];
    json.articles.forEach(element => {
        articles.push(Object.assign({}, element));
    });
    let renderData = {
        items : [],
        meta : {}
    }
    let sortJSON = articles.sort(articlesSort(data.sortField, data.sortOrder));
    renderData.items = sortJSON;
    data.page ? renderData.meta.page = data.page : renderData.meta.page = 1;
    data.limit ? renderData.meta.limit = data.limit : renderData.meta.limit = 10;
    renderData.meta.count = sortJSON.length;
    renderData.meta.pages = Math.ceil(renderData.meta.count / renderData.meta.limit);
    renderData.items = renderData.items.filter((el, i) => {
        return i < (renderData.meta.limit * renderData.meta.page) && i >= (renderData.meta.limit * (renderData.meta.page - 1))
    })
    if(!data.includeDeps) {
        renderData.items = renderData.items.map((el)=>{
            delete el.comments;
            return el;
        })
    }
    cb(null, renderData)
}

function articlesSort(sortField, sortOrder) {
    return function innerSort (a, b) {
        let res = 0
        if(a[sortField].toUpperCase() > b[sortField].toUpperCase()) {
            res = 1;
        }else if(a[sortField].toUpperCase() < b[sortField].toUpperCase()) {
            res = -1;
        }
        return ((sortOrder === 'des') ? (res * -1) : res)
    }
}

function getAllArticles(req, res, payload, cb) {
    let keys = Object.keys(payload);
    if(keys.indexOf('sortField') !== -1 && keys.indexOf('sortOrder') !== -1) {
        getArticlesWithParametrs(payload, cb);
    }else {
        cb(null, json);
    }
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