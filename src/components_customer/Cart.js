import React from 'react';
import './customerWindowGUI.css'

function Cart(props) {
    return (
        <div class="cart-delivery">
            <div className="order-summary">
                <div className="block1 width-1">
                    <h2 className="sub-headers">Order Summary</h2>
                    <button className='customize_button'>Place Order</button>
                </div>
            </div>  
            <div className="delivery">  
                <h2 className="delivery_heading">Delivery Address</h2>
                <form className ="form">
                    <label className="text-boxes">
                        <input type="text" placeholder="12345 Main St." />
                        <br></br>
                        <input type="text" placeholder="Dallas, TX" />
                        <br></br>
                        <input type="text" placeholder="73628" />
                        <br></br>
                    </label>
                </form>
                <button className='save-address-button'>Save Address</button>
            </div>
        </div>
    )
}

export default Cart;