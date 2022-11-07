import React from 'react';
import './customerWindowGUI.css'

export default function DeliveryInput() {
    return (
        <header>
            <h2 className="delivery_heading">Enter Delivery Address</h2>
                <div className='add-menu-item'>
                    <div className='input-class'>
                        <form>
                            <label>
                                <input type="text" placeholder="12345 Main St." />
                                <br></br>
                                <input type="text" placeholder="Dallas, TX" />
                                <br></br>
                                <input type="text" placeholder="73628" />
                                <br></br>
                            </label>
                        </form>
                    </div>
                    <div className='submit-class'>
                        <button className='save-address-button'>Save Address</button>
                    </div>
                </div>    
        </header>
    );
}