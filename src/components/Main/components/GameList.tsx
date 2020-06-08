import * as React from 'react';
import * as ReactDOM from 'react-dom';

import GameItem from './ui/GameItem';
import io from 'socket.io-client';

export default class GameList extends React.Component<any,any>{
    constructor(props:any){
        super(props);
        this.state = {
            games: [],
            elements: null
        };
        var socket = io();
        socket.on("message",(data:any) => {
            if(data == "newGame") this.updateList();
        });
    }
    componentWillMount(){
        this.updateList();
    }
    
    updateList(){
        fetch('/getGames').then(res => res.json()).then(data => this.setState({games: data},()=>this.makeList()));
    }
    
    makeList(){
        let elements:any = [];
        Object.entries(this.state.games).map((game:any,index:number) => {
            elements.push(<GameItem name={game[1].gameName} count={game[1].playerCount} ID={game[1].uniqueID} key={index}/>);
        });
        this.setState({elements: elements});
    }

    render(){
        return(
            <div id="game-list">
                {this.state.elements}
            </div>
        );
    }
}