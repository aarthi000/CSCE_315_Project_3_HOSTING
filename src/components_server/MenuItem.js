import React from 'react';
import Row from 'react-bootstrap/Row';
import Popup from './customizePopup';
import {useState} from 'react';

/* import getMenuitems from '../appdb';*/

export default function MenuItems(props) {
    const [buttonPopup, setButtonPopup] = useState(false);
    const {item, onAdd} = props;
    return (
        <div className="item-block">
            <div className="item">
                <div className="row-format">
                    <h3 className="item-name">{item.itemname}</h3>
                    <div className="price">
                        <h3>${item.itemprice}</h3>
                    </div>
                </div>

                {/* <button className='customize_button'>+</button> */}
                <main className='menu-btn'>
                <button onClick={() => onAdd(item)} className='customize_button'>Add to Cart</button>
                <button onClick={()=> setButtonPopup(true)} className='customize_button'>Customize</button>
                </main>
                <Popup trigger={buttonPopup} setTrigger={setButtonPopup}></Popup>
                {/* <button className='customize_button'>-</button> */}
            </div>
        </div>
    )
}
