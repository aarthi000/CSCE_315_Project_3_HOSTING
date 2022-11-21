// import logo from './images/revs.png';
import './customerWindowGUI.css';
import Cart from './Cart';
import Menu from './Menu';
import Header from './Header';
import React, {Fragment, useEffect, useState} from "react";
import DeliveryInput from './deliveryAddress';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MenuItems from './MenuItem';


function Customer(props) {
  const[menuitems, setMenuitems] = useState([]);

  const getMenuitems = async () => {
    try{
      const response = await fetch ("http://localhost:4999/menuitems_list");
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

  // const {items} = data;
  // const {items} = menuitems;
  const{items, onAdd} = props;

  return ( 
    // <div className="Customer Customer-header">
    <Container col>
        <Header></Header>
        {/* <div className="row"> */}
        <Row>
          {/* <Menu items={items}></Menu> */}
          <main className = "width-2">
            <h2 className="sub-headers1">Menu Items</h2>
            <div className="row"></div>
            {menuitems.map((item) => (
                <MenuItems key={item.id} item={item} onAdd={onAdd}></MenuItems>
            ))}
        </main>
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
