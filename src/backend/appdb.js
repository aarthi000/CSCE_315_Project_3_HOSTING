const client = require('./connection.js');
const express = require('express');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
client.connect();

app.listen(3300, () => {
     console.log("Server is now listening at port 3300");
   });


app.get('/restock', (req,res)=> {
      client.query(`Select * from inventory`, (err,result) => {
          if(!err) {
              const data = result.rows;
              var  resStr = '';
              data.forEach(row =>  { if (row.ingredientremaining < row.minimumamount) {
                                      resStr += `${row.ingredient} ${row.ingredientremaining}
                                              ${row.minimumamount}` + '<br>';
                                   }
                                });
              res.send(resStr);
          }
      });
      client.end;
});

app.get('/sales', (req,res)=> {
      var  resStr = '';
      let starttime = '9/18/2022';
      let endtime = '9/24/2022';

      let  startDateSplit = starttime.split("/");

      let startMonth = startDateSplit[0];
      let startDay = startDateSplit[1];

      let endDateSplit = endtime.split("/");
      let endMonth = endDateSplit[0];
      let endDay = endDateSplit[1];

      let query = "SELECT * FROM order_history WHERE orderday >= '"
                     + startDay + "' AND ordermonth >= '" + startMonth + "' AND orderday <= '"
                     + endDay + "' AND ordermonth <= '" + endMonth + "';";

      client.query(query, (err,result) => {
          if(!err) {
              const data = result.rows;
              data.forEach(row =>  {
                  resStr += `${row.orderpk} ${row.orderid} ${row.lineitem} ${row.itemname}
                             ${row.itemprice} ${row.orderday} ${row.ordermonth} ${row.orderyear}`
                             + '<br>';
                                   
                                });
              res.send(resStr);
          }
          else {
              res.send(err);
          }
      });

      client.end;
});

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
