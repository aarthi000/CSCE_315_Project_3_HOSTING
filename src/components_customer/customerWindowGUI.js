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

  /**
   * @function 'getMenuitems' - Function to get menu items 
   * @return {void}
   */
  const getMenuitems = async () => {
    try{
      const response = await fetch ("https://rev-api-customer.onrender.com/menuitems_list");
      // const response = await fetch ("http://localhost:4999/menuitems_list");
      const jsonData = await response.json();
      setMenuitems(jsonData);

    }catch (err){
      console.error("Error in getMenuitems() in customerWindowGUI");
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

  // const onAdd = (item) => 
  //checks for adding menuitem
  const[ingredients_map, setIngredients_Map] = useState([]);

  /**
   * @function 'getIngredientsMap' - Function to get contents of ingredient map 
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
   * @function 'getInventory' - Function to get inventory of ingredients
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
   * @function 'ingredientInStock' - Function to get ingredients in stock given the ingredient name and required amount 
   * @param {string} ingred - name of the ingredient
   * @param {number} numRequired - required amount
   * @return {boolean} true if ingredient is in stock, false otherwise
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
   * @function 'itemInStock' - Function to check if the menu item is in stock
   * @param {string} menuitem - name of the menu item
   * @return {boolean} true if menu item is in stock, false otherwise
   */
  const itemInStock = async (menuitem) => {
    try{
      await getIngredientsMap();
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
  
  
  /**
   * @function 'onAdd' - Function to add order
   * @param {string} item - name of the menu item
   * @return {void}
   */
  const onAdd = async (item) => {
    // var inStock = await itemInStock(item.itemname);
    // if (!inStock){
    //   alert(item.itemname + " is out of stock. Please order something else.");
    //   return;
    // }
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

  /**
   * @function 'onRemove' - Function to remove an item from  order
   * @param {string} item - name of the menu item
   * @return {void}
   */
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
