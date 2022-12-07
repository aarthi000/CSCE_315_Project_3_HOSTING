import React from 'react';
import './serverWindowGUI.css'
import { Row } from 'react-bootstrap';

export default function Header(props) {
   /**
    * @function 'removeOrder' - Function to remove order 
    * @return {void}
    */
    const removeOrder = async () => {
        try{
          const response = await fetch ("https://rev-api-customer.onrender.com/removeLastOrder");
          // const response = await fetch ("http://localhost:4999/removeLastOrder");
          await alert("Order remove successful!");
          
    
        }catch (err){
          await alert("Order remove not successful due to past menuitem in order that no longer exists!");
    
          console.error("Error in removeOrder() ");
          console.error(err.message);
        }
      }
   /**
    * @function 'isGameDay' - Function to check if it is gameday
    * @return {void}
    */
    const isGameDay = async () => {
        try{
          const response = await fetch ("https://rev-api-customer.onrender.com/isGameDay");
          // const response = await fetch ("http://localhost:4999/isGameDay");
          alert("Today is game day!");
    
        }catch (err){
          console.error("Error in isGameDay() in Header.js");
          console.error(err.message);
        }
    }
   /**
    * @function 'isNotGameDay' - Function to check if it is not gameday
    * @return {void}
    */
    const isNotGameDay = async () => {
      try{
        const response = await fetch ("https://rev-api-customer.onrender.com/isNotGameDay");
        // const response = await fetch ("http://localhost:4999/isNotGameDay");
        alert("Today is not game day.");

  
      }catch (err){
        console.error("Error in isNotGameDay() in  Header.js");
        console.error(err.message);
      }
  }

    return (
        <div>
            <h2 className="welcome">Welcome Server!</h2>
        
            <div className="server-btns">    
                <button onClick={() => isGameDay()} className="customize_button1">Gameday</button>
                <button onClick={() => isNotGameDay()} className="customize_button1">Not Gameday</button>
                <button onClick={() => removeOrder()} className="customize_button1">Remove Last Order</button>
            </div>
        </div>
    );
}
