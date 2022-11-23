const express = require("express");
const cors = require("cors");
const pool = require("./connection1");
const bodyParser = require("body-parser");
const app = express();


//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.listen(4999, () => {
    console.log("customerAPI.js is now listening at port 4999");
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
        console.error("haha isnt working loser")
    }
});

async function getIngredients(menuitem) {
    var response = await pool.query(
      "SELECT * FROM ingredient_map WHERE itemname = '" + menuitem + "'"
    );
    var data = response.rows[0];
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

        console.log(menuitems);
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





