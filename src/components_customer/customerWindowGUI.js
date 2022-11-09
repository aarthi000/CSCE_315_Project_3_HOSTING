import './customerWindowGUI.css';
import Cart from './Cart';
import Menu from './Menu';
import data from './tempData';
import Header from './Header';
import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function Customer() {
  const {items} = data;
  return ( 
    <Container>
        <Header></Header>
        <Row>
            <Menu items={items}></Menu>
            <Cart></Cart>
          </Row>
    </Container>

  );
}

export default Customer;
