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





