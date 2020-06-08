import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class GameItem extends React.Component<any,any> {
    constructor(props:any){
        super(props);
        this.state = {
            count: this.props.count || 0,
            disabled: true
        };
    }

    componentDidMount(){
        if(this.state.count < 2) this.setState({disabled:false});
    }

    render(){
        return(
            <form action="/join-game" method="POST">
                <div className="game-item">
                    <div>
                        <p>{this.props.name || "noName"}</p>
                    </div>
                    <div>
                        <p>{this.state.count}/2</p>
                    </div>
                    <input type="text" style={{display:"none"}} value={this.props.ID} name="gameID"/>
                    <div>
                        <button type="submit" disabled={this.state.disabled}>Join</button>
                    </div>
                </div>
            </form>
        );
    }
}