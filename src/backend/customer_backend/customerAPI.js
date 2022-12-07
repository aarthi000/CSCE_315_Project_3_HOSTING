const express = require("express");
const cors = require("cors");
const pool = require("./connection1");
const bodyParser = require("body-parser");
const { rmSync } = require("fs");
const app = express();
const PORT = process.env.PORT || 4999;



//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.listen(PORT, () => {
    console.log(`customerAPI.js is now listening at port ${PORT}`);
});


//ROUTES//

//get menu items for display
app.get("/menuitems_list", async(req,res) => {
    try{
        var menuitems = await pool.query("SELECT * from menu_items");
        var rows = menuitems.rows;
        for (var i = 0; i < rows.length; i++){
            rows[i].id = i + 1;
        }

        var data = {
            items: rows
        };

        res.json(data);

        
    }catch (err){
        console.error("/error in menuitems_list in customerAPI")
    }
});

// get employee for oauth
app.get("/getemployee", async(req,res) => {
    try{
        var employees = await pool.query("SELECT * from employee");
        var rows = employees.rows;
        console.log("working !!!");
        console.log(rows);

        res.json(rows);

        
    }catch (err){
        console.error("getEmployee isn't working in customerAPI")
    }
});



async function getIngredients(menuitem) {
    var response = await pool.query(
      "SELECT * FROM ingredient_map WHERE itemname = '" + menuitem + "'"
    );
    var data = response.rows[0];
    console.log(data);
    delete data.itemname;
    return data;
  }



app.post("/placeOrder", async (req, res) => {
    try {;
        console.log("Started API req");
        
        //handling reponse from API post request
        var menuitems = []; 
        var itemprices = [];
        var isGameday = false; //find a way to dynamically set

        var data = req.body;
        for (var i = 0; i < data.length; i++){
            for (var j = 0; j < data[i].qty; j++){
                menuitems.push(data[i].itemname);
                itemprices.push(data[i].itemprice);
            }
        }

        // console.log(menuitems);
        //updating db
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
        console.log("finished API req"); //flag: comment out



    } catch (err) {
        console.error("Error in placeOrder; see below");
        console.error(err.message);
    }
});

//get menu items for display
app.get("/lastOrder", async(req,res) => {
    try{
        var menuitems = await pool.query("SELECT MAX(orderid) as max_orderids FROM order_totals");
        var rows = menuitems.rows[0];
        res.json(rows);
    }catch (err){
        console.error("Error in customerAPI: /lastOrder")
    }
});

//get all ingredients in specified format for addons customize window
app.get("/addons", async(req,res) => {
    try{
        var addons = await pool.query("select * from ingredient_map");
        var data = addons.rows        
        var all = [];

        for (var i = 0; i < data.length; i++){
            var rows = data[i];
            var items = [];
            var ingredients = {items};

            var j = 0; 
            for (var key of Object.keys(rows)){
                if (rows[key] != 0 && key != 'itemname'){
                    items[j] = {
                        id: j + 1,
                        itemname: key
                    };
                    j++
                }
            }
            all[i] = {menuitem: rows.itemname, ingredients};
        }
        
        // for (var k = 0; k < all.length; k++){ //getting a specific item
        //     if (all[k].menuitem == 'Grilled Cheese'){
        //         console.log(all[k].ingredients);
        //     }
        // }

        res.json(all);


        
    }catch (err){
        console.error("Error in customerAPI: /addons")
    }
});


app.get("/ingredients_list", async(req,res) => {
    try{
        var addons = await pool.query("select * from inventory");
        var data = addons.rows        
        var items = [];
        for (var i = 0 ; i < data.length; i++){
            items[i] = {
                id: i+1,
                itemname: data[i].ingredient
            };
        }
        var retval = {items};
        res.json(retval);
    }catch (err){
        console.error("Error in customerAPI: /ingredients_list")
    }
});

app.get("/ingredients_map", async(req,res) => {
    try{
        var map = await pool.query("select * from ingredient_map");
        var data = map.rows;
        res.json(data);
    }catch (err){
        console.error("Error in customerAPI: /ingredients_list")
    }
});

app.get("/inventory_customer", async(req,res) => {
    try{
        var data = await pool.query("select * from inventory");
        
        res.json(data.rows);

    }catch (err){
        console.error("Error in customerAPI: /inventory_customer")
        console.error(err.message)

        
    }
});

app.get("/coordinates", async(req,res) => {
    try{
        var data = await pool.query("SELECT MAX(orderid) as max_orderids FROM coordinates");
        var orderid = data.rows[0].max_orderids;
        var coordinates = await pool.query("SELECT * from coordinates where orderid = " + orderid);
        res.json(coordinates.rows);

    }catch (err){
        console.error("Error in customerAPI: /coordinates")
        console.error(err.message)
    }
});

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

app.get("/removeLastOrder", async(req,res) => {
    try{
        console.log("Starting removeLastOrder ");
        var data1 = await pool.query("SELECT MAX(orderid) as max_orderids FROM order_history");
        var data2 = await pool.query("SELECT MAX(orderid) as max_orderids FROM order_totals");
        var orderid1 = data1.rows[0].max_orderids;
        var orderid2 = data2.rows[0].max_orderids;
 
        removeLastOrder();
        console.log("Finished removeLastOrder ");
        res.json(orderid1);

    }catch (err){
        console.error("Error in customerAPI: /removeLastOrder")
        console.error(err.message)
    }
});

app.get("/isGameDay", async(req,res) => {
    try{
        console.log("Starting isGameDay ");
        
        //get current data and format
        const date = new Date();
        var orderday = date.getDate();
        var ordermonth = date.getMonth() + 1; //0-based indexing    
        var orderyear = date.getFullYear();
        var query = "UPDATE order_history SET isgameday = true WHERE orderday = "+ orderday +" and ordermonth = "+ ordermonth +" and orderyear = "+ orderyear+" and isgameday = false";
        var data = await pool.query(query);

       

        res.json("doesn't return anything, simply updates order_history :)");
        console.log("Finished isGameDay");


    }catch (err){
        console.error("Error in customerAPI: /isGameDay")
        console.error(err.message)
    }
});


//isnotgameday

app.get("/isNotGameDay", async(req,res) => {
    try{
        console.log("Starting isNotGameDay ");
        
        //get current data and format
        const date = new Date();
        var orderday = date.getDate();
        var ordermonth = date.getMonth() + 1; //0-based indexing    
        var orderyear = date.getFullYear();
        var query = "UPDATE order_history SET isgameday = false WHERE orderday = "+ orderday +" and ordermonth = "+ ordermonth +" and orderyear = "+ orderyear+" and isgameday = true";
        var data = await pool.query(query);

       

        res.json("doesn't return anything, simply updates order_history :)");
        console.log("Finished isNotGameDay");


    }catch (err){
        console.error("Error in customerAPI: /isGameDay")
        console.error(err.message)
    }
});

//addon
app.post("/addOnUpdate", async(req,res) => {
    try{
        console.log("Started addOnUpdate");

        var data = req.body;
        var ingredient = data.itemname;

        //getting todays date

        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        }
        function formatDate(date) {
            return [
                date.getFullYear(),
                padTo2Digits(date.getMonth() + 1),
                padTo2Digits(date.getDate()),
            ].join('-');
        }
        var date = formatDate(new Date());
    
        //check if in addons_history_copy
        var q = "select * from addons_history_copy where date= '" + date + "'";
        var tbl = await pool.query(q);
        // console.log(tbl.rows);
        if (tbl.rows.length == 0){
           return;
        }

        //update addons_history_copy
        var updateUsed = "update addons_history_copy set " + ingredient + "=" + ingredient + "+" + 1 + " where date='"
        + date
        + "'";

        var query = await pool.query(updateUsed);
        var change = await pool.query("select * from addons_history_copy where date = '2022-12-06'");

         //update inventory
        var amountused = "update inventory set amountused=amountused+" + 1
                                + " where ingredient='" + ingredient + "'";
        var ingredientremaining = "update inventory set ingredientremaining=ingredientremaining-" + 1
                                + " where ingredient='" + ingredient + "'";
                    

        var query1 = await pool.query(amountused);
        var query2 = await pool.query(ingredientremaining);

        res.send("Hello");
        console.log("finished addOnUpdate");


    }catch (err){
        console.error("Error in customerAPI: /addOnUpdate")
        console.error(err.message)
    }
});


