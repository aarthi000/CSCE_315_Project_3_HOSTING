import React, {Fragment, useEffect, useState} from "react";
import './serverWindowGUI.css'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import addonOrderItems from "./customizePopup"

function Cart(props) {
    const {orderItems, onAdd, onRemove} = props;
    
    const itemsPrice = orderItems.reduce((a, c) => a + c.qty * c.itemprice, 0);

    const sendOrder = async () => {
        try{
          const body = orderItems;
          const response = await fetch (/*"http://localhost:4999/placeOrder"*/"https://revs-api.onrender.com/placeOrder",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
          });
    
        }catch (err){
          console.error("Error in sendOrder in Cart.js -- see below msg:");
          console.error(err.message);
        }
        localStorage.clear();
        if(localStorage.length === 0)
            sOutput.innerHTML = "";
      }

    

    //   useEffect(()=> { //only for testing. need to comment out and actually call function properly!
    //     console.log("f");
    //     sendOrder();
    //   }, []);


    return (
        <div class="cart-delivery">
            {/* <div className="delivery">  
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
                <div className="save-add-div"><button className='save-address-button'>Save Address</button></div>
            </div> */}
            <div className="order-summary">
                <div className="block1 width-1">
                    <h2 className="sub-headers">Order Summary</h2>
                    <div>
                        {orderItems.length === 0 && <div className = "cart-item">Cart is Empty</div>}
                    </div>
                    {orderItems.map((item) => (
                        <Row key={item.itemname}>
                            <div className="display-item">{item.itemname}</div>
                            <div className='order-sum-button'>
                                <button onClick = {() => onAdd(item)} className="qty-btn">+</button>
                                <button onClick = {() => onRemove(item)} className="qty-btn">-</button>
                            </div>
                            
                            <div className="display-price">{item.qty} X ${item.itemprice.toFixed(2)}</div>
                        </Row>
                    ))}
                    {/* <div>{addonOrderItems}</div> */}
                    {orderItems.length !== 0 && (
                        <h2 className="display-item">Order Total: ${itemsPrice.toFixed(2)}</h2>
                    )}
                    <button onClick={() => sendOrder()} className='customize_button'>Place Order</button>
                    
                </div>
            </div>  
            
        </div>
        
    )
}

export default Cart;