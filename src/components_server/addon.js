import React from 'react';
import './serverWindowGUI.css';
import AddonItems from './addonItem';


function Addon(props) {
    const{items, addonAdd, addonRemove} = props;
    return (
        <main className = "width-2">
            {/* <h2 className="sub-headers1">Add-On Items</h2> */}
            {/* <div className="row"></div> */}
            {items?.map((item) => (
                <AddonItems key={item?.id} item={item} addonAdd={addonAdd} addonRemove={addonRemove}></AddonItems>
            ))}
        </main>
    )
}

export default Addon;