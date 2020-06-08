import * as React from 'react';
import * as ReactDOM from 'react-dom';

import p5 from "p5";
import io from "socket.io-client";

if(location.pathname == "/game"){
    require('./css/main.css');
}

export default class Game extends React.Component<any,any> {

    s = (s:p5) => {
        var size = 300;
        var scl = size/3;

        let board = new tictactoe(scl,s);
        this.setState({board: board});

        s.setup = () => {
            let canvas = s.createCanvas(size,size);
            s.noLoop();
            canvas.parent("container");
            canvas.id("game");
            // console.log(this.state.board);
        }

        s.draw = () => {
            s.background(255);
            this.state.board.show();
        }

        s.mouseClicked = () => {
            let item:cell;
            for(let i = 0;i<3;i++){
                for(let j = 0;j<3;j++){
                    item = this.state.board.grid[i][j].check(s.mouseX,s.mouseY,scl);
                    if(typeof item != "boolean"){
                        checkClick(item.row,item.col);
                        break;
                    }
                }
            }
        }
        
        var checkTurn = () => {
            if(this.state.game.turn == this.state.player.id) return true;
            else return false;
        }

        var updateTurn = () => {
            if(this.state.game.turn == this.state.game.player1.id){
                this.state.game.turn = this.state.game.player2.id;
            }else this.state.game.turn = this.state.game.player1.id;
        }

        var checkClick = (row:number,col:number) => {
            // console.log(this.state.board.grid[row][col]);
            // console.log(this.state.player);
            if(this.state.board.grid[row][col].value == "none" && checkTurn()){
                this.state.game.grid[row][col] = this.state.player.shape;
                this.state.board.grid[row][col].value = this.state.player.shape;
                updateTurn();
                s.redraw();
                this.socket.emit("updateGame",this.state.game);
                this.socket.emit("update",this.state.player);
            }
        }
    }

    socket:SocketIOClient.Socket;

    constructor(props:any){
        super(props);

        this.state = {
            game: null,
            board: null,
            player: null,
            sketch: null,
            text: null
        }

        this.socket = io();

        this.socket.on('update',()=>{
            this.update();
        });

        this.socket.on('getSocket',()=>{
            this.getPlayer();
        });

        this.socket.emit("message","newGame");
    }

    componentWillMount(){
        this.update().then(()=>this.getPlayer())
        .then(() => {
            this.socket.emit('updateSocket',{gameID: this.state.game.uniqueID,player: this.state.player});
            this.socket.emit('update',this.state.player);
            this.socket.emit('getSocket',this.state.player);
        });
    }

    componentDidMount(){
        this.setState({sketch:new p5(this.s)});
    }

    update(){
        return new Promise((resolve) => {
            fetch('/getGame').then(res => res.json()).then(data => this.setState({game:data},()=> {
                // console.log(this.state.game);
                for(let i = 0;i<3;i++){
                    for(let j = 0;j<3;j++){
                        this.state.board.grid[i][j].value = this.state.game.grid[i][j];
                    }
                }
                this.state.sketch.redraw();
                resolve();
            }));
        });
    }

    getPlayer(){
        return new Promise((resolve) => {
            fetch('/getPlayer').then(res => res.json()).then(data => this.setState({player: data},()=>resolve()));
        });
    }

    render(){
        
        return(
            <div>
                <div id="container">
                    <form action="/leave-game" method="POST">
                        <button type="submit"></button>
                    </form>
                </div>
            </div>
        );
    }
}


class tictactoe {

    grid: cell[][];
    s: p5;
    scl:number;

    constructor(scl:number,sketch:p5){
        this.s = sketch;
        this.scl = scl;
        this.grid = [];
        let x = 0,y = 0;
        for(let i = 0;i<3;i++){
            this.grid[i] = [];
            for(let j = 0;j<3;j++){
                this.grid[i][j] = new cell(x,y,i,j);
                x += scl;
            }
            x = 0;
            y += scl;
        }
    }
    
    show(){
        this.s.strokeWeight(3);
        this.s.line(this.scl,0,this.scl,this.s.height);
        this.s.line(this.scl*2,0,this.scl*2,this.s.height);
        this.s.line(0,this.scl,this.s.width,this.scl);
        this.s.line(0,this.scl*2,this.s.width,this.scl*2);
        this.s.strokeWeight(1);
        for(let i = 0;i<3;i++){
            for(let j = 0;j<3;j++){
                this.grid[i][j].show(this.s,this.scl);
            }
        }
    }

    checkGame(){

    }
}

class cell {
    value:string = "none";
    x:number;
    y:number;
    row:number;
    col:number;

    constructor(x:number,y:number,row:number,col:number){
        this.x = x;
        this.y = y;
        this.row = row;
        this.col = col;
    }

    check(mouseX:number,mouseY:number,scl:number){
        if(this.x < mouseX && this.x+scl > mouseX && this.y < mouseY && this.y+scl > mouseY){
            return this;
        }else return false;
    }

    show(sketch:p5,scl:number){
        if(this.value == "x"){
            sketch.line(this.x,this.y,this.x+scl,this.y+scl);
            sketch.line(this.x+scl,this.y,this.x,this.y+scl);
        }else if(this.value == "o"){
            sketch.circle(this.x+scl/2,this.y+scl/2,scl);
        }
    }
}