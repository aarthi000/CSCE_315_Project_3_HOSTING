import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
/* import getMenuitems from '../appdb';*/

export default function MenuItems(props) {
    const {item} = props;
    return (
        <div className="item-block">
            <div className="item">
                <button className='customize_button'>Customize</button>
                <button className='customize_button'>+</button>
                <button className='customize_button'>-</button>

                <div className="place-holder">.</div>
            </div>
        </div>
    )
}
