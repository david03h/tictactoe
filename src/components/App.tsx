import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Main from './Main/Main';
import Game from './Game/Game';

export default class App extends React.Component<any,any>{
    constructor(props:any){
        super(props);

    }

    render(){
        return(
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/">
                            <Main/>
                        </Route>
                        <Route path="/game">
                            <Game/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}