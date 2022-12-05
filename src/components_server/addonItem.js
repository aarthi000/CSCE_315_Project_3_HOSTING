import React from 'react';
import Row from 'react-bootstrap/Row';
import Popup from './customizePopup';
import {useState} from 'react';

/* import getMenuitems from '../appdb';*/

export default function AddonItems(props) {
    const {item, addonAdd} = props;
    console.log('hello');
    return (
        
        <div className="item-block">
            <div className>
                <Row>
                    <h3 className="item-name-addon">{item.itemname}</h3>
                </Row>
                <main>
                <button onClick={() => addonAdd(item)} className='customize_button1'>+</button>
                {/* <button onClick={() => addonRemove(item)} className='customize_button1'>-</button> */}
                </main>
            </div>
        </div>
    )
}
