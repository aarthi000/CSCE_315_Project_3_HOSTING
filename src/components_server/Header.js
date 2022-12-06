import React from 'react';
import './serverWindowGUI.css'
import { Row } from 'react-bootstrap';

export default function Header(props) {
    const removeOrder = async () => {
        try{
          // const response = await fetch ("https://rev-api-customer.onrender.com/removeLastOrder");
          const response = await fetch ("http://localhost:4999/removeLastOrder");
          await alert("Order remove successful!");
          
    
        }catch (err){
          await alert("Order remove not successful due to past menuitem in order that no longer exists!");
    
          console.error("Error in removeOrder() ");
          console.error(err.message);
        }
      }
    return (
        <div>
            <h2 className="welcome">Welcome Server!</h2>
        
            <div className="server-btns">    
                <button className="customize_button1">Gameday</button>
                <button className="customize_button1">Not Gameday</button>
                <button onClick={() => removeOrder()} className="customize_button1">Remove Last Order</button>
            </div>
        </div>
    );
}