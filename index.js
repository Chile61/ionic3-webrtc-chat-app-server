const socketio = require('socket.io');
const bodyparser = require('body-parser');
const http = require('http');
const https = require('https');

const SERVER_PORT_NUMBER = 8000;
const server = http.createServer().listen(SERVER_PORT_NUMBER, '0.0.0.0');
const io = socketio.listen(server);
console.log("Listening on port", SERVER_PORT_NUMBER);

io.sockets.on('connection', client => {

	broadcastActiveUsers = () => {
		console.log("ACTIVE USERS");
		let users = {};
		for(let sock in io.sockets.sockets){
			console.log(io.sockets.sockets[sock].displayName);
			users[io.sockets.sockets[sock].id] =
			{
				displayName: io.sockets.sockets[sock].displayName,
				id: io.sockets.sockets[sock].id
			};
		}
		io.of('/').emit('display-names-updated', { users: users });
	}

	let originalId = client.id;
	io.sockets.sockets[client.id].displayName = client.id;
	broadcastActiveUsers();
	// console.log(Object.keys(io.sockets.sockets));
	//client.emit('omae_wa_mou_shindeiru');

	client.on('updated-display-name', (newDisplayName) => {
		// client.emit('nane', {});
		// client.broadcast.emit('other_name', {});
		io.sockets.sockets[client.id].displayName = newDisplayName;
		broadcastActiveUsers();
	});

	client.on('request-session', (destinationClientId) => {
		console.log("EMITTING SESS CONF");
		client.to(destinationClientId).emit('session-confirmed', client.id);
	});

	client.on('initial-offering', (initialOfferingPackage) => {
		let { initialOffer, destinationClientId } =  initialOfferingPackage;
		let response = {
			initialOffer: initialOffer,
			senderClientId: client.id
		};
		client.to(destinationClientId).emit('initial-offering-response', response);
	});

	client.on('answer', (answerPackage) => {
		let { answer, destinationClientId} = answerPackage;
		let response = {
			answer: answer,
			senderClientId: client.id
		};
		client.to(destinationClientId).emit('answer-given', response);
	});

	client.on('ice-candidate', (candidatePackage) => {
		const { candidate, destinationClientId } = candidatePackage;
		client.to(destinationClientId).emit('remote-sending-ice-candidate', candidate);
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
