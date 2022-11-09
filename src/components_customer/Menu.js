import React from 'react';
import './customerWindowGUI.css'
import MenuItems from './MenuItem';


function Menu(props) {
    const{items} = props;
    return (
        <main className = "width-2">
            <h2 className="sub-headers1">Menu Items</h2>
            <div className="row"></div>
            {items.map((item) => (
                <MenuItems key={item.itemtype} item={item}></MenuItems>
            ))}
        </main>
    )
}

export default Menu;