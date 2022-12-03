// import logo from './images/revs.png';
import './customerWindowGUI.css';
import Cart from './Cart';
import Menu from './Menu';
import Header from './Header';
import Addon from './addon';
import React, {Fragment, useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function Customer(props) {
  const[menuitems, setMenuitems] = useState([]);

  const getMenuitems = async () => {
    try{
      // const response = await fetch ("https://revs-api.onrender.com/menuitems_list");
      const response = await fetch ("http://localhost:4999/menuitems_list");
      const jsonData = await response.json();
      setMenuitems(jsonData);

    }catch (err){
      console.error("i will kms fr:  see error message below");
      console.error(err.message);
    }
  }

  useEffect(()=> {
    getMenuitems();
  }, []);
  
  const [orderItems, setOrderItems] = useState([]);
  
  const {items} = menuitems;
  // console.log("menuitems")
  // console.log(menuitems);

  const onAdd = (item) => {
    const exist = orderItems.find(x => x.id === item.id);
    if (exist) {
      const newItems = orderItems.map((x) => 
      x.id === item.id ? {...exist, qty: exist.qty + 1} : x
      )
      setOrderItems(newItems);
      localStorage.setItem('orderItems', JSON.stringify(newItems));
    } else {
      const newItems = [...orderItems, {...item, qty: 1}];
      setOrderItems(newItems);
      localStorage.setItem('orderItems', JSON.stringify(newItems));
    } 

    };

    const onRemove = (item) => {
      const exist = orderItems.find(x => x.id === item.id);
      if (exist.qty === 1) {
        const newItems = orderItems.filter((x) => x.id !== item.id);
        setOrderItems(newItems);
        localStorage.setItem('orderItems', JSON.stringify(newItems));
      } else {
          const newItems = orderItems.map((x) => 
            x.id === item.id ? {...exist, qty: exist.qty - 1} : x);
          setOrderItems(newItems);  
          localStorage.setItem('orderItems', JSON.stringify(newItems));
      }
    };

    

    useEffect(() => {
      setOrderItems(localStorage.getItem('orderItems') ? JSON.parse(localStorage.getItem('orderItems')):[]);
    },[])
  return ( 
    // <div className="Customer Customer-header">
    <Container col>
        <Header></Header>
        <div className="row-format">
            <Menu onAdd={onAdd} items={items}></Menu>
            <Cart onAdd={onAdd} onRemove={onRemove} orderItems={orderItems}></Cart>
          </div>
    </Container>

  );
}

export default Customer;
