const express = require('express'),
api = express.Router();

api.get('/getGames', (req,res) => {
    res.json(express.games);
});

api.get('/getGame', (req,res) => {
    let session = req.session;
    if(!session.uniqueID) return res.send("Not in a game");

    let game = express.games[session.uniqueID];
    
    if(!game) return res.json("Error occurred");
    else res.json(game);
});

api.get('/getPlayer', (req,res) => {
    let session = req.session;
    if(!session.player) return res.send("Not in a game");

    let game = express.games[session.uniqueID];
    let player;
    if(session.player == game.player1.id) player = game.player1;
    else player = game.player2;
    
    res.json(player);
});

module.exports = api;