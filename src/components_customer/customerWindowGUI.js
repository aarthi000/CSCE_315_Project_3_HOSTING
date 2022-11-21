// import logo from './images/revs.png';
import './customerWindowGUI.css';
import Cart from './Cart';
import Menu from './Menu';
import data from './tempData';
import Header from './Header';
import React, {Fragment, useEffect, useState} from "react";
import DeliveryInput from './deliveryAddress';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function Customer() {
  const[menuitems, setMenuitems] = useState([]);

  const getMenuitems = async () => {
    try{
      const response = await fetch ("http://localhost:5000/menuitems_list");
      const jsonData = await response.json();
      console.log(jsonData);
      setMenuitems(jsonData);

    }catch (err){
      console.error("i will kms fr:  see error message below");
      console.error(err.message);
    }
  }

  useEffect(()=> {
    getMenuitems();
  }, []);

  const {items} = data;
  // const {items} = menuitems;

  return ( 
    // <div className="Customer Customer-header">
    <Container col>
        <Header></Header>
        {/* <div className="row"> */}
        <Row>
          <Menu items={items}></Menu>
          {/* <div className="Customer Customer-header"> */}
          <Col>
            <Cart></Cart>
            <DeliveryInput></DeliveryInput>
          </Col>  
          {/* </div> */}
        
          {/* </div> */}
        </Row>
    </Container>

  );
}

export default Customer;
