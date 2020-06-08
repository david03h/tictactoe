
class TicTacToe {
    uniqueID;
    player1 = { id: null, shape: null, socketID: null };
    player2 = { id: null, shape: null, socketID: null };
    playerCount;
    grid = [["none","none","none"],["none","none","none"],["none","none","none"]];
    started = false;
    ended = false;
    winner;
    gameName;
    password;

    turn;

    constructor(ID,player,gameName,password){
        this.uniqueID = ID;
        this.player1.id = player;
        this.gameName = gameName;
        this.playerCount = 1;
        this.password = password;

        let random = this.getRandom();
        if(random == 0) {this.player1.shape = "x"; this.player2.shape = "o";}
        else {this.player1.shape = "o"; this.player2.shape = "x";}
    }

    Join(player){
        if(this.player1.id){
            this.player2.id = player;
            this.started = true;
        }
        else this.player1.id = player;
        this.playerCount += 1;
        this.randomTurn();
    }

    randomTurn(){
        if(this.playerCount == 2){
            let random = this.getRandom();
            random == 0 ? this.turn = this.player1.id : this.turn = this.player2.id;
        }
    }

    getRandom(){
        let random = Math.round(Math.random());
        return random;
    }

    leaveGame(player){
        if(player == this.player1.id){
            this.player1.id = undefined;
        }else this.player2.id = undefined;
    }

    clearGame(){
        this.playerCount -= 1;
        this.started = false;
        this.grid = [["none","none","none"],["none","none","none"],["none","none","none"]];
        this.turn = undefined;
    }
}

module.exports = TicTacToe;