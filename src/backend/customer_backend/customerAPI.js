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
    console.log("Server is now listening at port 5000");
  });


//ROUTES//

//get menu items for display
app.get("/menuitems_list", async(req,res) => {
    try{
        const menuitems = await pool.query("SELECT * from menu_items");
        res.json(menuitems.rows);
    }catch (err){
        console.error("haha isnt working loser")
    }
});

app.get('/inventory', (req,res)=> {
      pool.query(`Select * from inventory`, (err,result) => {
          if(!err) {
              const data = result.rows;
              var  resStr = '';
              data.forEach(row =>  resStr += `${row.ingredient} ${row.ingredientremaining}
                                              ${row.amountused} ${row.minimumamount}` + '<br>');
              res.send(resStr);
          }
      });
});



