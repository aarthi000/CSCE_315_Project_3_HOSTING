const express = require("express");
const cors = require("cors");
const pool = require("./connection1");
const bodyParser = require("body-parser");
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

/*Function to return hashmap of ingredients in an menuitem. 
Parameter = string of menuitem name*/

async function getIngredients(menuitem) {
  var response = await pool.query(
    "SELECT * FROM ingredient_map WHERE itemname = '" + menuitem + "'"
  );
  var data = response.rows[0];
  delete data.itemname;
  return data;
}

async function ingredientInStock(ingred, numRequired) {
  var response = await pool.query("select * from inventory");
  var inventory = response.rows;

  //for api
  for (var i = 0; i < inventory.length; i++){
    if (inventory[i].ingredient == ingred){
      var numLeft = inventory[i].ingredientremaining;
      if (numLeft < numRequired) {
        console.log(ingred + " not in stock for required amount: " + numRequired);
        return false;
      }
      else{
        console.log(ingred + " IS in stock for required amount: " + numRequired);
        return true;
      }
    }
  }
}


async function itemInStock(menuitem) {

  // var ingredients = await getIngredients(menuitem);
  var data = await pool.query("select * from inventory");
  var data1 = await pool.query("select * from ingredient_map");

  var map = data1.rows;
  for (var i = 0; i < map.length; i++){    
    if (map[i].itemname == menuitem){
      ingredients = map[i];
      for (var key of Object.keys(ingredients)) {
        if (ingredients[key] != 0 && key != 'itemname') {
            var inStock = await ingredientInStock(key, ingredients[key]);   
          if (!inStock) {
            console.log(menuitem + " is not in stock because " + key + " is not in stock");
            return false;
          }
        }
      }
      console.log(menuitem + " IS in stock");
      return true;
    }
  }

}

/*
placeOrder(): takes in ordered menuitems, itemprices, and gameday and places order
parameters: array of strings, array of itemprices, boolean
*/
async function placeOrder(menuitems, itemprices, isGameday){
    //check if empty list
    if (menuitems.length == 0 || itemprices.length == 0 || menuitems.length != itemprices.length){
        console.log("Empty or mismatching menuitem list");
        return;
    }
    

    //get most recent orderID
    var response = await pool.query(
        "SELECT MAX(orderid) as max_orderids FROM order_totals"
    );
    var orderid = response.rows[0].max_orderids + 1;

    //create line item
    var lineitem = 0;

    //create totalprice 
    var totalprice = 0.0;

    
    //get current data and format
    const date = new Date();
    var orderday = date.getDate();
    var ordermonth = date.getMonth() + 1; //0-based indexing    
    var orderyear = date.getFullYear();

    
    //loop through menuitems
    for (var i = 0; i < menuitems.length; i++){
        // increment lineitem
        lineitem++;

        //get itemname
        var itemname = "'" + menuitems[i] + "'";


        // get price
        var itemprice = itemprices[i];

        //generate orderpk
        var orderpk = "'" + orderid + "_" + lineitem + "'";

        //send query to update order_history
        var insertInto = "INSERT INTO order_history(orderpk, orderid, lineitem, itemname, itemprice, isgameday, orderday, ordermonth, orderyear) ";
        var values = "VALUES(" + orderpk + "," + orderid + "," + lineitem + "," + itemname + "," + itemprice +
                    "," + isGameday + "," + orderday + "," + ordermonth + "," + orderyear + ")";
        var insertCMD = insertInto + values;
        await pool.query(  //uncomment me!
            insertCMD
        );

        //update inventory//
        //getting hashmap of ingredients 
        var ingredients = await getIngredients(menuitems[i]);

        for (var key of Object.keys(ingredients)) {
            if (ingredients[key] != 0) {
                var updateUsed = "update inventory set amountused=amountused+" + ingredients[key]
                            + " where ingredient='" + key + "';";
                var updateRemaining = "update inventory set ingredientremaining=ingredientremaining-"
                            + ingredients[key] + " where ingredient='" + key + "';";
                

                await pool.query(  //uncomment me!
                    updateUsed
                );

                await pool.query(  //uncomment me!
                    updateRemaining
                );
            }
        }
        
        //sum price
        totalprice += itemprices[i];
        totalprice = Math.round(totalprice * 100.0) / 100.0;

    }
    //update order totals 
    var totalQuery = "INSERT INTO order_totals(orderid,totalprice) VALUES (" + orderid + "," + totalprice + ");";

    await pool.query(  //uncomment me!
        totalQuery
    );

}



/*
removeOrder(): removes order given orderID (int)
*/
async function removeOrder(orderID){
    //query order_history
    console.log("Starting removeOrder ");

    var history_response = await pool.query(  //uncomment me!
      "select * from order_history where orderid = " + orderID
    );

    var menuitems = history_response.rows;
    // console.log(menuitems);

    //figure out what items were ordered, store in array
    var itemsOrdered = [];
    for (var i = 0; i < menuitems.length; i++){
      itemsOrdered.push(menuitems[i].itemname);
    }
    if (itemsOrdered.length == 0){
      console.log("Order doesn't exist or has already been deleted");
      return;
    }
  

    //delete from order_history 
    await pool.query(  //uncomment me!
    "delete from order_history where orderid = " + orderID
    );

    // delete from order totals
    await pool.query(  //uncomment me!
    "delete from order_totals where orderid = " + orderID
    );
    

    //delete from inventory (opp of place order function)
    
    for (var i = 0; i < itemsOrdered.length; i++){
      var ingredients = await getIngredients(itemsOrdered[i]);
      
        for (var key of Object.keys(ingredients)) {
            if (ingredients[key] != 0) {
                var updateUsed = "update inventory set amountused=amountused-" + ingredients[key]
                            + " where ingredient='" + key + "';";
                var updateRemaining = "update inventory set ingredientremaining=ingredientremaining+"
                            + ingredients[key] + " where ingredient='" + key + "';";
                
                await pool.query(  //uncomment me!
                    updateUsed
                );

                await pool.query(  //uncomment me!
                    updateRemaining
                );
            }
        }
        
    }
    console.log("finishing removeOrder ");
      
}

async function removeLastOrder(){
  //get most recent orderID
  console.log("starting removeLastOrder ");

  var response = await pool.query(
    "SELECT MAX(orderid) as max_orderids FROM order_totals"
  );
  var orderid = response.rows[0].max_orderids;
  removeOrder(orderid);
  console.log("finishing removeLastOrder ");
  
}




//TESTING
//this is how to call function!

// console.log(getIngredients("seasonedTaterTots").then(function(result){
//     console.log(result)
//   }));

// ingredientInStock("seasoning_4g", 500).then(function (result) {
//     console.log(result);
//   });

// itemInStock("Revs Burger").then(function (result) {
//   console.log(result);
// });

//testing placeOrder
// var m = [];
// m.push("Revs Burger", "Tater Tots");

// var p = [];
// p.push(10, 2.29);

// var g = true;

// placeOrder(m, p, g);

//testing removeorder
// removeOrder(10070); //chose a different number/, this has already been used


// removeLastOrder();