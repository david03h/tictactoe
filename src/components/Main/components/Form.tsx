import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default function Form(){
    return(
        <div id="create-game">
            <form action="/create-game" method="POST">
                <div>
                    <p>Game name</p>
                    <input type="text" name="gamename" maxLength={15} required/>
                    <span></span>
                </div>
                <div>
                    <p>Password</p>
                    <input type="text" name="password" maxLength={8}/>
                    <span></span>
                </div>
                <button type="submit">PLAY</button>
            </form>
        </div>
    );
}