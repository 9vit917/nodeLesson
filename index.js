const fs = require('fs');

let results = {};

fs.readFile('./Test/example.txt', (err, logData) => {
    if (err) throw err;
    let log = logData.toString().split('\n');
    log.forEach(function(line) {
        var parts = line.split(' ');
        var letter = parts[1];
        var count = parseInt(parts[2]);
        if (!results[letter]) {
            results[letter] = 0;
        }
        results[letter] += parseInt(count);
    });
    console.log(results);
});