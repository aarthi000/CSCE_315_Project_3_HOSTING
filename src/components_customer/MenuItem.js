import React from 'react';

export default function MenuItems(props) {
    const {item} = props;
    return (
        <div>
            <h3>{item.name} ${item.price}</h3>

            <div>
                <button className='customize_button'>Customize</button>
                <button className='customize_button'>+</button>
                <button className='customize_button'>-</button>
            </div>
            <div>.</div>
        </div>
    )
}