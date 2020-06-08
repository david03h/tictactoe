const express = require('express');

module.exports = function(io) {
	io.on('connection', (socket) => {

        socket.on('update', (player) => {
            // console.log("update", player);
            socket.broadcast.to(player.socketID).emit('update');
        });
        
        socket.on('updateGame', (data) => {
            let game = express.games[data.uniqueID];
            game.turn = data.turn;
            game.grid = data.grid;
        });

        socket.on('updateSocket', ({gameID,player}) => {
            let game = express.games[gameID];

            if(player.id == game.player1.id) {
                game.player2.socketID = socket.id;
            }
            else {
                game.player1.socketID = socket.id;
            }
        });

        socket.on('getSocket', (player) => {
            // console.log("getSocket", player);
            socket.broadcast.to(player.socketID).emit('getSocket');
        });

        // socket.on('disconnect',()=>{
        //     console.log(socket.id,"disconnected");
        // });

		socket.on('message', (data) => {
            if(typeof data == "object"){
                let game = express.games[data.uniqueID]; 
                game.turn = data.turn;
                game.grid = data.grid;
            }
            socket.broadcast.emit('message', data);
		});
    });
    
};