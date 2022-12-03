import React from 'react';
import './customizePopup.css'
import './customerWindowGUI.css';
import Cart from './Cart';
import Addon from './addon'
import Header from './Header';
import {useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import addonsData from './tempAddons'


function Popup(props) {
    //const[addonitems, setAddonItems] = useState([]);

////////
//   const getMenuitems = async () => {
//     try{
//       const response = await fetch ("http://localhost:4999/menuitems_list");
//       const jsonData = await response.json();
//       setAddonItems(jsonData);

//     }catch (err){
//       console.error("i will kms fr:  see error message below");
//       console.error(err.message);
//     }
//   }

//   useEffect(()=> {
//     getMenuitems();
//   }, []);
  
///////

  const [addonOrderItems, setAddonOrderItems] = useState([]);
  const {items} = addonsData; /// change this to addonitems
  // console.log("items");
  // console.log(items);

  const addonAdd = (item) => {
    const exist = addonOrderItems.find(x => x.id === item.id);
    if (exist) {
      const newItems = addonOrderItems.map((x) => 
      x.id === item.id ? {...exist, qty: exist.qty + 1} : x
      )
      setAddonOrderItems(newItems);
      localStorage.setItem('addonOrderItems', JSON.stringify(newItems));
    } else {
      const newItems = [...addonOrderItems, {...item, qty: 1}];
      setAddonOrderItems(newItems);
      localStorage.setItem('addonOrderItems', JSON.stringify(newItems));
    } 
    console.log("ADDONS-ADD");
    console.log(addonOrderItems);

    };

    const addonRemove = (item) => {
      const exist = addonOrderItems.find(x => x.id === item.id);
      if (!exist) {
        const newItems = [...addonOrderItems, {...item, qty: -1}];
        setAddonOrderItems(newItems);
        localStorage.setItem('addonOrderItems', JSON.stringify(newItems));
      } else {
          const newItems = addonOrderItems.map((x) => 
            x.id === item.id ? {...exist, qty: exist.qty - 1} : x);
            setAddonOrderItems(newItems);  
          localStorage.setItem('addonOrderItems', JSON.stringify(newItems));
      }
      console.log("ADDONS-REMOVE");
      console.log(addonOrderItems);
    };

    useEffect(() => {
        setAddonOrderItems(localStorage.getItem('addonOrderItems') ? JSON.parse(localStorage.getItem('addonOrderItems')):[]);
    },[])

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button onClick={() => props.setTrigger(false)} className="close-btn">Close</button>
                {props.children}
                <Container col>
                    <Row>
                        <h2 className="sub-headers2">Add-On Items</h2>
                        <Addon items={items} addonAdd={addonAdd} addonRemove={addonRemove}></Addon>
                        {/* <Cart addonOrderItems={addonOrderItems}></Cart> */}
                    </Row>
                </Container>
            </div>
        </div>
    ) : "";
}

export default /*{addonOrderItems,}*/ Popup;