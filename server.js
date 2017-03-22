// HTTP PORTION

var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8080);

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	// console.log("The Request is: " + parsedUrl.pathname);
		
	fs.readFile(__dirname + parsedUrl.pathname, 
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			res.writeHead(200);
			res.end(data);
  		}
  	);
  	
}


// WEBSOCKET PORTION

// tracks which team to assign
var teamNum=1;
var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', 

	function (socket) {
		

		console.log("We have a new client: " + socket.id);
		// store new user's id
		var clientId=socket.id;
		if (teamNum%2==1){
			console.log('odd team');
			console.log("member is " + clientId);
			// increase counter to assign nex user to different team
			teamNum++;
			// tel new user they are on the even team
			io.to(clientId).emit('oddTeam');
			// io.sockets.socket(clientId).emit('oddTeam');
			// socket.broadcast.to(clientId).emit('oddTeam');
		}
		else if(teamNum%2==0){
			console.log('even team');
			console.log("member is " + clientId);
			// increase counter to assign next user to other team
			teamNum++;
			// tell new user they are on the even team
			io.to(clientId).emit('evenTeam');
			// io.sockets.socket(clientId).emit('evenTeam');
			// socket.broadcast.to(clientId).emit('evenTeam');
		}
		///MY SOCKET EVENTS HERE
		socket.on('orientation', function(data){
			// console.log('alpha: '+ data.alpha);
			// console.log(data.team);

			// communicate change in water level
			socket.broadcast.emit('newHeight', data);
		});


		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);