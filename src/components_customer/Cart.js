import React from 'react';
import './customerWindowGUI.css'

function Cart(props) {
    return (
        <aside className="block width-1">
            <h2>Order Summary</h2>
            <button className='customize_button'>Place Order</button>
        </aside>
    )
}

export default Cart;