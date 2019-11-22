// client.js
const net = require('net');
const port = 8124;
const qa = require('./qa.json');

const client = new net.Socket();

let counter = 0;

function shuffle(arr){
	var j, temp;
	for(var i = arr.length - 1; i > 0; i--){
		j = Math.floor(Math.random()*(i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
}

function ask(obj) {
  if(counter < obj.length) {
    counter += 1;
    client.write(obj[counter].question, ask(obj));
    
    console.log(counter);
  }
}

let questions = shuffle(qa.questions);

client.setEncoding('utf8');

client.connect(port, function() {
  console.log('Connected');
  client.write("QA");
});

client.on('data', function(data) {
  console.log(data);
  if(data === 'ACK') {
    process.stdin.resume();
    process.stdin.on('data', (data) => client.write(data));
  } else {
    client.destroy();
  }
});

client.on('close', function() {
  console.log('Connection closed');
});