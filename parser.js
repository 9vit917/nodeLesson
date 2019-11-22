// Конструктор обработчика
var Parser = function() {
 
};
 
// Обрабатывает заданный текст
Parser.prototype.parse = function(text) {
 
    var results = {};
    
    // Текст превращает в массив строчек
    var lines = text.split('\n');
    
    lines.forEach(function(line) {
        var parts = line.split(' ');
        var letter = parts[1];
        var count = parseInt(parts[2]);
    
        if(!results[letter]) {
            results[letter] = 0;
        }
        
        results[letter] += parseInt(count);
    });
    
    return results;
};
 
// Экспортирует конструктор типа Parser из этого модуля
module.exports = Parser;