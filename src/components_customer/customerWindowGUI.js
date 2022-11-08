// import logo from './images/revs.png';
import './customerWindowGUI.css';
import Cart from './Cart';
import Menu from './Menu';
import data from './tempData';
import Header from './Header';
import React from "react";
import DeliveryInput from './deliveryAddress';



function Customer() {
  const {items} = data;
  return (
    <div className="Customer Customer-header">
        <Header></Header>
        <div className="row">
          <Menu items={items}></Menu>
          <div className="Customer Customer-header">
            <Cart></Cart>
            <DeliveryInput></DeliveryInput>
          </div>

        </div>
    </div>

  );
}

export default Customer;
