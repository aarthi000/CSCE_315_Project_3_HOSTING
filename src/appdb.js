const client = require('./connection.js');
const express = require('express');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.listen(3300, () => {
     console.log("Server is now listening at port 3300");
   });

client.connect();

app.get('/inventory', (req,res)=> {
      client.query(`Select * from inventory`, (err,result) => {
          if(!err) {
              const data = result.rows;
              var  resStr = '';
              data.forEach(row =>  resStr += `${row.ingredient} ${row.ingredientremaining}
                                              ${row.amountused} ${row.minimumamount}` + '<br>');
              res.send(resStr);
          }
      });
      client.end;
});
