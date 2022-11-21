const express = require("express");
const cors = require("cors");
const pool = require("./connection1");
const bodyParser = require("body-parser");
const app = express();


//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.listen(5000, () => {
    console.log("customerAPI.js is now listening at port 5000");
  });


//ROUTES//

//get menu items for display
app.get("/menuitems_list", async(req,res) => {
    try{
        const menuitems = await pool.query("SELECT * from menu_items");
        // var data = menuitems.rows; //uncomment and test
        // res.json(data[0]);
        res.json(menuitems.rows);
    }catch (err){
        console.error("haha isnt working loser")
    }
});





