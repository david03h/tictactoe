const express = require('express'),
main = express.Router(),
uniqid = require('uniqid'),
md5 = require('md5'),
io = require('socket.io-client');


basePath = express.basePath;

var socket = io("http://localhost:4000");

const game = require(basePath+'/game/tictactoe');
express.games = {};

main.get('/', (req,res) => {
    let session = req.session;
    if(session.player) return res.redirect('/game');

    res.render('base');
});

main.get('/game', (req,res) => {
    let session = req.session;
    if(!session.player) return res.redirect('/');

    res.render('base');
});

main.post('/create-game', (req,res) => {
    let session = req.session;
    var gameName = req.body.gamename,
    password = req.body.password;
    if(gameName == "" || gameName == undefined || typeof gameName != "string" || typeof password != "string" || gameName.length>15 || password.length>8) return res.send("Error 422. Invalid input");

    let passwd = md5(password);
    let gameID = uniqid("game-");
    let player = uniqid("player-");
    session.player = player;
    session.uniqueID = gameID;
    let newGame = new game(gameID,player,gameName,passwd);
    express.games[gameID] = newGame;

    res.redirect('/game');
});

main.post('/join-game', (req,res) => {
    let session = req.session;

    let gameID = req.body.gameID;
    let game = express.games[gameID];

    if(!game) return res.send("Game does not exist");

    // console.log(game);
    // console.log(gameID);

    session.uniqueID = gameID;
    session.player = uniqid("player-");
    express.games[gameID].Join(session.player);
    res.redirect('/game');

    socket.emit("message","newGame");
});

main.post('/leave-game', (req,res) => {
    let session = req.session;
    let gameID = session.uniqueID;
    let player = session.player;

    if(!session.uniqueID) return res.send("Not in game");

    var game = express.games[gameID];
    let playerSocket;

    if(player == game.player1.id) playerSocket = game.player1;
    else playerSocket = game.player2;

    game.clearGame();
    
    socket.emit("update",playerSocket);

    game.leaveGame(player);

    if(game.playerCount == 0) {
        express.games[game.uniqueID] = undefined;
        game = undefined;
    }

    socket.emit("message","newGame");

    session.destroy();

    res.redirect('/');
});

module.exports = main;