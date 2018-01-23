const socketio = require('socket.io');
const bodyparser = require('body-parser');
const http = require('http');
const https = require('https');

const SERVER_PORT_NUMBER = 8000;
const server = http.createServer().listen(SERVER_PORT_NUMBER, '0.0.0.0');
const io = socketio.listen(server);

io.sockets.on('connection', client => {
	console.log(Object.keys(io.sockets.sockets));
	//client.emit('omae_wa_mou_shindeiru');
	//client.on('example', () => {
	//	client.emit('nane', {});
	//	client.broadcast.emit('other_name', {});
	//});
});
