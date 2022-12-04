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

  const[ingredientsList, setIngredientsList] = useState([]);

  const getIngredientsList = async () => {
    try{
      // const response = await fetch ("https://revs-api.onrender.com/ingredients_list");
      const response = await fetch ("http://localhost:4999/ingredients_list");
      const jsonData = await response.json();
      setIngredientsList(jsonData);

    }catch (err){
      console.error("error in getIngredientsList in customizePop.js");
      console.error(err.message);
    }
  };
  const[ingredients_map, setIngredients_Map] = useState([]);

  const getIngredientsMap = async () => {
    try{
      // const response = await fetch ("https://revs-api.onrender.com/ingredients_map");
      const response = await fetch ("http://localhost:4999/ingredients_map");
      const jsonData = await response.json();
      setIngredients_Map(jsonData);

    }catch (err){
      console.error("error in getIngredientsMap in customizePop.js");
      console.error(err.message);
    }
  };

  const[inventory, setInventory] = useState([]);

  const getInventory = async () => {
    try{
      // const response = await fetch ("https://revs-api.onrender.com/inventory_customer");
      const response = await fetch ("http://localhost:4999/inventory_customer");
      const jsonData = await response.json();
      setInventory(jsonData);

    }catch (err){
      console.error("error in getInventory in customizePop.js");
      console.error(err.message);
    }
  };
  
  const addonInMenuItem = async (_addon, _menuitem) => {
    try{
      await getIngredientsMap();
      var data = await ingredients_map;
      for (var i = 0 ; i < data.length; i++){
          if (data[i].itemname == _menuitem){
              var item = data[i];
              for (var key of Object.keys(item)){
                  if (item[_addon] == 0){
                      console.log(_addon + " is not in " + _menuitem);
                      return false;
                  }else{
                      console.log(_addon + " is in " + _menuitem);
                      return true;
                  }
              }
          }
      }
    }catch (err){
      console.error("error in addonInMenuItem in customizePop.js");
      console.error(err.message);
    }
  };


  //ingredint in stock
  //ingredient > 0
  //menu item in stock 
 

  
  useEffect(()=> {
    getIngredientsList();
    getIngredientsMap();
    getInventory();
  }, []);

  const [addonOrderItems, setAddonOrderItems] = useState([]);
  const {items} = ingredientsList; 

  const[allAddOns, setAllAddOns] = useState([]);

  const getAllAddOns = async () => {
    try{
      // const response = await fetch ("https://revs-api.onrender.com/addons");
      const response = await fetch ("http://localhost:4999/addons");
      const jsonData = await response.json();
      setAllAddOns(jsonData);

    }catch (err){
      console.error("error in getAllAddOns in customizePop.js");
      console.error(err.message);
    }
  }


  

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
    // console.log("ADDONS-ADD");
    // console.log(addonOrderItems);

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
      // console.log("ADDONS-REMOVE");
      // console.log(addonOrderItems);
    };

    useEffect(() => {
        getIngredientsList();
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