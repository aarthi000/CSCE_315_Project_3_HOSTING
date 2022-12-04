import React from 'react';
import './serverWindowGUI.css'
import { Row } from 'react-bootstrap';

export default function Header(props) {
    return (
        <div>
            {/* <Row> */}
                {/* <h1>Gameday Toggle<input type="checkbox" className="gameday" id="gameday" name="gameday" value="isGameday"></input></h1> */}
                
            {/* </Row> */}
            <h2 className="welcome">Welcome Server!</h2>
        
            <div className="server-btns">    
                <button className="customize_button1">Gameday</button>
                <button className="customize_button1">Not Gameday</button>
                <button className="customize_button1">Remove Last Order</button>
            </div>
        </div>
    );
}