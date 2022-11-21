import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
/* import getMenuitems from '../appdb';*/

export default function MenuItems(props) {
    const {item, onAdd} = props;
    return (
        <div className="item-block">
            <div className="item">
                <Row>
                    <h3 className="item-name">{item.itemname}</h3>
                    <div className="price">
                        <h3>${item.itemprice}</h3>
                    </div>
                </Row>

                {/* <button className='customize_button'>+</button> */}
                <button onClick={() => onAdd(item)} className='customize_button'>Add to Cart</button>
                <button className='customize_button'>Customize</button>
                {/* <button className='customize_button'>-</button> */}
            </div>
        </div>
    )
}
