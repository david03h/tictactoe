import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Form from './components/Form';
import GameList from './components/GameList';

if(location.pathname == "/"){
    require('./css/main.css');
}

export default class Main extends React.Component<any,any>{
    render(){
        return(
            <div id="container">
                <div>
                    <Form/>
                </div>
                <div>
                    <GameList/>
                </div>
            </div>
        );
    }
}