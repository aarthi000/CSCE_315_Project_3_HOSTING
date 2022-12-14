import React, {Fragment, useEffect, useState} from "react";
import './serverWindowGUI.css'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import addonOrderItems from "./customizePopup"

function Cart(props) {
    const {orderItems, onAdd, onRemove} = props;
    
    const itemsPrice = orderItems.reduce((a, c) => a + c.qty * c.itemprice, 0);

  /**
   * @function 'sendOrder' - place the order from cart
   * @return {void}
   */
    const sendOrder = async () => {
        try{
          const body = orderItems;
          const response = await fetch (/*"http://localhost:4999/placeOrder"*/"https://rev-api-customer.onrender.com/placeOrder",{
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
	const[orderid, setOrderid] = useState([]);

  /**
   * @function 'getOrderid' - Function to get order id
   * @return {void}
   */
const getOrderid = async () => {
    try{

      // const response = await fetch ("http://localhost:4999/lastOrder");
      const response = await fetch ("https://rev-api-customer.onrender.com/lastOrder");


      const jsonData = await response.json();
      setOrderid(jsonData.max_orderids + 1);
      // console.log("Type:");
      // console.log(typeof jsonData.max_orderids);
      // console.log("Data:");
      // console.log(jsonData.max_orderids);
    }catch (err){
      console.error("i will kms fr:  see error message below");
      console.error(err.message);
    }
  }
  /**
   * @function 'orderPlaced' - Function to display alert that order is placed
   * @return {void}
   */
      function orderPlaced() {
        alert("Order has been placed successfully!")
        window.location.reload() 
      }

    

    //   useEffect(()=> { //only for testing. need to comment out and actually call function properly!
    //     console.log("f");
    //     sendOrder();
    //   }, []);


    return (
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
                    <button onClick={() => {sendOrder(); getOrderid(); orderPlaced();}} className='customize_button'>Place Order</button>
                    
                </div>
            </div>  
        
    )
}

export default Cart;
