// const client = require('./connection.js');
// const express = require('express');
// const app = express();

// const bodyParser = require("body-parser");
// app.use(bodyParser.json());
// client.connect();

// app.listen(3300, () => {
//      console.log("Server is now listening at port 3300");
//    });

// app.use(function(req,res,next) {
//    res.header("Content-Type", "application/json");
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//    next();
// });

// app.get('/restock', (req,res)=> {
//       var restockjson = { inventory:[]};
//       client.query(`Select * from inventory`, (err,result) => {
//           if(!err) {
//               const data = result.rows;
//               inventory = [];

//               data.forEach(row =>  { if (row.ingredientremaining < row.minimumamount) {
//                                        jsondata = {};
//                                        jsondata["ingredientremaining"] = row.ingredientremaining;
//                                        jsondata["ingredient"]          = row.ingredient;
//                                        jsondata["minimumamount"]       = row.minimumamount;
//                                        inventory.push(jsondata);
//                                    }});
//               //data.forEach(row =>  { if (row.ingredientremaining < row.minimumamount) {
//               //                        resStr += `${row.ingredient} ${row.ingredientremaining}
//               //                                ${row.minimumamount}` + '<br>';
//               //                     }});
//               res.json(inventory);
//               console.log(inventory);
//           }
//       });
//       client.end;
// });

// app.post('/sales', (request,response)=> {
//       var  resStr = '';
//       const b = request.body;

//                    //const queryObject = url.parse(request.url, true).query;
//                    //console.log(queryObject.startdate);
//                    //console.log(queryObject.enddate);
//                    //let starttime = '9/18/2022';
//                    //let endtime = '9/24/2022';

//       let starttime = b.startdate;
//       let endtime   = b.enddate;

//       let  startDateSplit = starttime.split("/");
//       let startMonth      = startDateSplit[0];
//       let startDay        = startDateSplit[1];
//       //let startYear       = startDateSplit[2];

//       let endDateSplit = endtime.split("/");
//       let endMonth     = endDateSplit[0];
//       let endDay       = endDateSplit[1];
//       //let endYear    = endDateSplit[2];

//       let query = "SELECT * FROM order_history WHERE orderday >= '"
//                      + startDay + "' AND ordermonth >= '" + startMonth + "' AND orderday <= '"
//                      + endDay + "' AND ordermonth <= '" + endMonth + "';";

//      salesdata = [];
//       client.query(query, (err,result) => {
//           if(!err) {
//               const data = result.rows;
//               data.forEach(row =>  {
//                              salesrow = {}
//                              salesrow["orderpk"]    = row.orderpk;
//                              salesrow["orderid"]    = row.orderid;
//                              salesrow["lineitem"]   = row.lineitem;
//                              salesrow["itemname"]   = row.itemname;
//                              salesrow["itemprice"]  = row.itemprice;
//                              salesrow["orderday"]   = row.orderday;
//                              salesrow["ordermonth"] = row.ordermonth;
//                              salesrow["orderyear"]  = row.orderyear;
//                              salesdata.push(salesrow);
//               });
//               response.json(salesdata);
//           }
//           else {
//               response.send(err);
//           }
//       });

//       client.end;
// });

// app.post('/excess', (request,response)=> {
//       var  resStr = '';
//       const b = request.body;

//       let timeRangeQueryStart = "SELECT * FROM inventory_history WHERE date = '" + b.startdate + "';";
//       let timeRangeQueryEnd = "SELECT * FROM inventory_history WHERE date = '" + b.enddate + "';";
//       let startTimeMap = new Map();
// console.log(timeRangeQueryStart );
//       client.query(timeRangeQueryStart, (err,result) => {
//           if(!err) {
//               //const fields = result.fields.map(field => field.name);
//               const data = result.rows;
//               data.forEach(row =>  {
// console.log(row);
//                              startTimeMap.set(row.fieldname, row.fieldvalue)
//                                 });
//           }
//           else {
//               response.send(err);
//           }
//       });
//       console.log(startTimeMap);

//       var endList = []; 
//       client.query(timeRangeQueryEnd, (err,result) => {
//           if(!err) {
//               const fields = result.fields.map(field => field.name);
//               const data = result.rows;
//               let i = 0;
//               data.forEach(row =>  { endList[i++] = row.fieldvalue });
//           }
//           else {
//               response.send(err);
//           }
//       });
//       console.log(endList);

//       resStr = '';
//       let i = 0;
//       for (const [key, value] of startTimeMap) {
//          if(endList[i++] > (0.9 * value ))
//              resStr += key + '<br>';
//           console.log(`${key} = ${value}`);
//       }
//       response.send(resStr);
//       client.end;
// });

// app.get('/inventory', (req,res)=> {
//       client.query(`Select * from inventory`, (err,result) => {
//           if(!err) {
//               const data = result.rows;
//               var  resStr = '';
//               data.forEach(row =>  resStr += `${row.ingredient} ${row.ingredientremaining}
//                                               ${row.amountused} ${row.minimumamount}` + '<br>');
//               res.send(resStr);
//           }
//       });
//       client.end;
// });
