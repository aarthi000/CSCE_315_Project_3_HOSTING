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



/**
 * @function 'Popup' - Function to provide popup for misc functions
 * @param {Array} props - property array
 * @return {void}
 */
function Popup(props) {

  const[ingredientsList, setIngredientsList] = useState([]);

  /**
   * @function 'getIngredientsList' - Function to get ingredient list
   * @return {void}
   */
  const getIngredientsList = async () => {
    try{
      const response = await fetch ("https://rev-api-customer.onrender.com/ingredients_list");
      // const response = await fetch ("http://localhost:4999/ingredients_list");
      const jsonData = await response.json();
      setIngredientsList(jsonData);

    }catch (err){
      console.error("error in getIngredientsList in customizePop.js");
      console.error(err.message);
    }
  };
  const[ingredients_map, setIngredients_Map] = useState([]);

  /**
   * @function 'getIngredientMap' - Function to get ingredient map
   * @return {void}
   */
  const getIngredientsMap = async () => {
    try{
      const response = await fetch ("https://rev-api-customer.onrender.com/ingredients_map");
      // const response = await fetch ("http://localhost:4999/ingredients_map");
      const jsonData = await response.json();
      setIngredients_Map(jsonData);

    }catch (err){
      console.error("error in getIngredientsMap in customizePop.js");
      console.error(err.message);
    }
  };

  const[inventory, setInventory] = useState([]);

  /**
   * @function 'getInventory' - Function to get inventory 
   * @return {void}
   */
  const getInventory = async () => {
    try{
      const response = await fetch ("https://rev-api-customer.onrender.com/inventory_customer");
      // const response = await fetch ("http://localhost:4999/inventory_customer");
      const jsonData = await response.json();
      setInventory(jsonData);

    }catch (err){
      console.error("error in getInventory in customizePop.js");
      console.error(err.message);
    }
  };


  /**
   * @function 'addonInMenuItem' - Function to get menu items 
   * @param {string} _addon - name of the add on
   * @param {string} _menuitem - name of the menu item
   * @return {boolean} true if success
   */
  
  const addonInMenuItem = async (_addon, _menuitem) => {
    try{
      await getIngredientsMap();
      var data = await ingredients_map;
      for (var i = 0 ; i < data.length; i++){
          if (data[i].itemname == _menuitem){
              var item = data[i];
              for (var key of Object.keys(item)){
                  if (item[_addon] == 0){
                      // console.log(_addon + " is not in " + _menuitem);
                      return false;
                  }else{
                      // console.log(_addon + " is in " + _menuitem);
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

  /**
   * @function 'ingredientInStock' - Function to check if ingredient is in stock
   * @param {string} ingred - name of the ingredient
   * @param {number} numRequired - number of required ingredinets
   * @return {boolean} true if success
   */
  const ingredientInStock = async (ingred, numRequired) => {
    try{
      await getInventory();  
      var data = await inventory;    
      for (var i = 0; i < data.length; i++){
        if (data[i].ingredient == ingred){
          var numLeft = data[i].ingredientremaining;
          if (numLeft < numRequired) {
            // console.log(ingred + " not in stock for required amount: " + numRequired);
            return false;
          }
          else{
            // console.log(ingred + " IS in stock for required amount: " + numRequired);
            return true;
          }
        }
      }
    }catch (err){
      console.error("error in addonInMenuItem in customizePop.js");
      console.error(err.message);
    }
  };

  /**
   * @function 'isIngredientEmpty' - Function to check if ingredient is not available
   * @param {string} ingred - name of the ingredient
   * @return {boolean} true if success
   */
  const isIngredientEmpty = async (ingred) => {
    try{
      var inStock = await ingredientInStock(ingred, 1);
      if (inStock){
        // console.log(ingred + " has a stock greater than 0");
        return false;
      }
      else{
        // console.log(ingred + " does not have a stock greater than 0");
        return true;
      }
    }catch (err){
      console.error("error in addonInMenuItem in customizePop.js");
      console.error(err.message);
    }
  };

  /**
   * @function 'itemInStock ' - Function to check if menu item is in stock
   * @param {string} menuitem - name of the menu item
   * @return {boolean} true if success
   */
  const itemInStock = async (menuitem) => {
    try{
      await getIngredientsMap;
      var map = await ingredients_map;
      
      for (var i = 0; i < map.length; i++){    
        if (map[i].itemname == menuitem){
          var ingredients = map[i];
          for (var key of Object.keys(ingredients)) {
            if (ingredients[key] != 0 && key != 'itemname') {
                var inStock = await ingredientInStock(key, ingredients[key]);   
              if (!inStock) {
                // console.log(menuitem + " is not in stock because " + key + " is not in stock");
                return false;
              }
            }
          }
          // console.log(menuitem + " IS in stock");
          return true;
        }
      }
    }catch (err){
      console.error("error in addonInMenuItem in customizePop.js");
      console.error(err.message);
    }
  };


  //ingredient against a certain required value DONE
  //ingredient > 0 DONE
  //menu item in stock 
 

  
  useEffect(()=> {
    getIngredientsList();
    getIngredientsMap();
    getInventory();
  }, []);

  const [addonOrderItems, setAddonOrderItems] = useState([]);
  const {items} = ingredientsList; 

  const[allAddOns, setAllAddOns] = useState([]);

  /**
   * @function 'getAllAddOns' - get list of all add ons
   * @return {void}
   */
  const getAllAddOns = async () => {
    try{
      const response = await fetch ("https://rev-api-customer.onrender.com/addons");
      // const response = await fetch ("http://localhost:4999/addons");
      const jsonData = await response.json();
      setAllAddOns(jsonData);

    }catch (err){
      console.error("error in getAllAddOns in customizePop.js");
      console.error(err.message);
    }
  }


  const sendAddOn = async (addonItem) => {
    try{
      const body = addonItem;
      const response = await fetch ("https://rev-api-customer.onrender.com/addOnUpdate",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
      });
      // const response = await fetch ("http://localhost:4999/addOnUpdate",{
      //   method: "POST",
      //   headers: {"Content-Type": "application/json"},
      //   body: JSON.stringify(body),
      // });

    }catch (err){
      console.error("Error in sendOrder in Cart.js -- see below msg:");
      console.error(err.message);
    }  
  }

   
  // const addonAdd = (item) => 
  /**
   * @function 'addonAdd' - Function to add an Add on
   * @param {string} item - menu item
   * @return {void}
   */
  const addonAdd = async (item) => {
    // var inStock = await ingredientInStock(item.itemname, 0);
    // // console.log(inStock);
    // if (!inStock){
    //   alert(item.itemname + " is out of stock. Please order something else.");
    //   return;
    // }
    sendAddOn(item);
    alert(item.itemname + " has been added on to your order!");


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

    };

    useEffect(() => {
        getIngredientsList();
        setAddonOrderItems(localStorage.getItem('addonOrderItems') ? JSON.parse(localStorage.getItem('addonOrderItems')):[]);
    },[])

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                {/* <button onClick={() => props.setTrigger(false)} className="close-btn">Close</button> */}
                <button onClick={() => props.setTrigger(false)} className="close-btn">Close</button>

                {props.children}
                <Container col>
                    <Row>
                        <h2 className="sub-headers2">Add-On Items</h2>
                        <Addon items={items} addonAdd={addonAdd}></Addon>
                        {/* <Cart addonOrderItems={addonOrderItems}></Cart> */}
                    </Row>
                </Container>
            </div>
        </div>
    ) : "";
}

export default /*{addonOrderItems,}*/ Popup;
