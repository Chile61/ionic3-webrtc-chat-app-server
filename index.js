const socketio = require('socket.io');
const bodyparser = require('body-parser');
const http = require('http');
const https = require('https');

const SERVER_PORT_NUMBER = 8000;
const server = http.createServer().listen(SERVER_PORT_NUMBER, '0.0.0.0');
const io = socketio.listen(server);
console.log("Listening on port", SERVER_PORT_NUMBER);

io.sockets.on('connection', client => {
	let originalId = client.id;
	// console.log(Object.keys(io.sockets.sockets));
	//client.emit('omae_wa_mou_shindeiru');
	client.on('updated-display-name', (newDisplayName) => {
		// client.emit('nane', {});
		// client.broadcast.emit('other_name', {});

		io.sockets.sockets[client.id].name = newDisplayName;

		console.log("ACTIVE USERS");
		for(let sock in io.sockets.sockets){
			console.log(io.sockets.sockets[sock].name);
		}
	});

	client.on('disconnect', (a) => {
		console.log("A CLIENT DISCONNECTED B");
		console.log(`${client.id} disconnected`);
		console.log(`${a} disconnected`);
		console.log("A CLIENT DISCONNECTED TERM");
		// console.log(`${io.sockets.sockets[client.id].name} disconnected`);
		// for(let sock in io.sockets.sockets){
		// 	console.log(io.sockets.sockets[sock].name);
		// }
	});

});
