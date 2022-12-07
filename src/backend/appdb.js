const client = require('./connection.js');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3300;


const bodyParser = require("body-parser");
app.use(bodyParser.json());
client.connect();
/**
 * Function to specify and start listening to port for the server side 
 * @param  {} PORT
 * 
 */
app.listen(PORT, () => {
    console.log(`appdb.js is now listening at port ${PORT}`);
});

/**
 * Function to set initial configuration for the server side 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @param  {Function} next - next function to call middleware in the stack
 */
app.use(function(request,response,next) {
    response.header("Content-Type", "application/json");
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * @function 'restock' - GET function to return inventory data 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.get('/restock', (request,response)=> {
    var fs = require('fs');
    client.query(`Select * from inventory`, (err,result) => {
        if(!err) {
            const data = result.rows;
            inventory = [];

            data.forEach(row => { if (row.ingredientremaining < row.minimumamount) {
                                    jsondata = {};
                                    jsondata["ingredientremaining"] = row.ingredientremaining;
                                    jsondata["ingredient"]          = row.ingredient;
                                    jsondata["minimumamount"]       = row.minimumamount;
                                    inventory.push(jsondata);
                                }});
            //data.forEach(row =>  { if (row.ingredientremaining < row.minimumamount) {
            //                        retStr += `${row.ingredient} ${row.ingredientremaining}
            //                                ${row.minimumamount}` + '<br>';
            //                     }});
            response.json(inventory);
            // console.log(inventory);
            // fs.writeFile("../components/ReportData.json", JSON.stringify(inventory), function(err) {
            //     if (err) {
            //         throw err;
            //     }
            // })
        }
    });
    client.end;
});

/**
 * @function 'sales' - GET function to return sales report between two dates 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.get('/sales', async(request,response)=> {
    // var fs = require('fs');
    // const b = request.body;

                //const queryObject = url.parse(request.url, true).query;
                //console.log(queryObject.startdate);
                //console.log(queryObject.enddate);
                //let starttime = '9/18/2022';
                //let endtime = '9/24/2022';

    //getting most recent date from database
    var max = await client.query("SELECT MAX(id) as max_ids FROM sales_requests"); 
    var id = max.rows[0].max_ids;

    var data = await client.query("select * from sales_requests where id = " + id); 
    
    var b  = data.rows[0];
    delete b.id;

    //doing calculations
    let starttime = b.startdate;
    let endtime   = b.enddate;

    let startDateSplit  = starttime.split("/");
    let startMonth      = startDateSplit[0];
    let startDay        = startDateSplit[1];
    //let startYear       = startDateSplit[2];

    let endDateSplit = endtime.split("/");
    let endMonth     = endDateSplit[0];
    let endDay       = endDateSplit[1];
    //let endYear    = endDateSplit[2];

    let query = "SELECT * FROM order_history WHERE orderday >= '"
                + startDay + "' AND ordermonth >= '" + startMonth + "' AND orderday <= '"
                + endDay + "' AND ordermonth <= '" + endMonth + "';";

    salesdata = [];
    //console.log(query);
    client.query(query, (err,result) => {
        if(!err) {
            const data = result.rows;
            // data.forEach(row =>  {
            //             salesrow = {}
            //             salesrow["orderpk"]    = row.orderpk;
            //             salesrow["orderid"]    = row.orderid;
            //             salesrow["lineitem"]   = row.lineitem;
            //             salesrow["itemname"]   = row.itemname;
            //             salesrow["itemprice"]  = row.itemprice;
            //             salesrow["orderday"]   = row.orderday;
            //             salesrow["ordermonth"] = row.ordermonth;
            //             salesrow["orderyear"]  = row.orderyear;
            //             salesdata.push(salesrow);
            // });
            var itemSales = new Map();
            data.forEach(row => {
                        itemName = row.itemname;
                        if (itemSales.has(itemName)) {
                            itemSales.set(itemName, itemSales.get(itemName) + 1);
                        } else {
                            itemSales.set(itemName, 1);
                        }       
            });

            // console.log(itemSales);

            Array.from(itemSales.keys()).forEach(itemName => {
                salesrow = {}
                salesrow["itemname"] = itemName;
                salesrow["amountsold"] = itemSales.get(itemName);
                salesdata.push(salesrow);
            });
    // console.log(salesdata);
            response.json(salesdata);
            // fs.writeFile("../components/ReportData.json", JSON.stringify(salesdata), function(err) {
            //     if (err) {
            //         throw err;
            //     }
            // })
        }
        else {
            response.send(err);
        }
    });

    client.end;
});
/**
 * getTodaysDate - Function to return the today's date in the format YYYY-MM-DD
 * @return {String} - string of today's date
 */
var getTodaysDate = function() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();
    const formattedToday = yyyy + '-' + mm + '-' + dd;
    return formattedToday;

};
/**
 * @function 'excess' - GET function to return excess inventory data from a start date till today 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.get('/excess', async(request,response)=> {
    // var fs = require('fs');

    //getting most recent date from database
    var max = await client.query("SELECT MAX(id) as max_ids FROM excess_requests"); 
   
    var id = max.rows[0].max_ids;
    
    var data = await client.query("select * from excess_requests where id = " + id); 
    var b  = data.rows[0];
    delete b.id;
    

    //doing calculations

    var enddate = getTodaysDate();

    // startdate = 9/3/22
    // end date = 9/6/22, 12/02/22

    let timeRangeQueryStart = "SELECT * FROM inventory_history_copy WHERE date = '" + b.startdate + "';";
    let timeRangeQueryEnd = "SELECT * FROM inventory_history_copy WHERE date = '" + enddate + "';";

    const startTimeMap = new Map();
    const endTimeMap = new Map();
    var query = {
        text: timeRangeQueryStart,
        rowMode: 'array'
    };
    client.query(query, (err,result) => {
        if(!err) {
            // Split the column names into array of strings
            const fields = result.fields.map(field => field.name);
            const data = result.rows;
            data.forEach(row =>  {
                var i=0;
                // For each field, enter fieldname and value into Map
                for (i=1;i<fields.length;i++) {
                    startTimeMap.set(fields[i],row[i]);
                }
            });
            query  =  {
                text: timeRangeQueryEnd,
                rowMode: 'array'
            };
            // Run time end query
            client.query(query, (err,result) => {
                if(!err) {
                    const fields = result.fields.map(field => field.name);
                    const data = result.rows;
                    data.forEach(row =>  {
                        var i=0;
                        // For each field, enter fieldname and value into Map
                        for (i=1;i<fields.length;i++) {
                            endTimeMap.set(fields[i],row[i]);
                        }
                    });
                    if (endTimeMap.size == 0) {
                        var i=0;
                        // For each field, enter fieldname and value into Map
                        for (i=1;i<fields.length;i++) {
                            endTimeMap.set(fields[i],0);
                        }
                    }
                    currentValueMap = new Map();
                    client.query(`Select ingredient,ingredientremaining  from inventory`, 
                                   (err,result) => {
                        if(!err) {
                             const data = result.rows;
                             inventory = [];
                             data.forEach(row => {  
                                    currentValueMap.set( row.ingredient, row.ingredientremaining);
                                });
                             var i = 1;
                             excessData = [];
                             // compare the values and determine the excess
                             for (const [key, startvalue] of startTimeMap) {
                                 endval = endTimeMap.get(key);
                                 currVal = currentValueMap.get(key);
                                 if((startvalue - endval) < (0.1) * currVal) {
                                     excessRow = {};
                                     excessRow["itemname"] = key;
                                     excessData.push(excessRow);
                                 } 
                             } 
                            //console.log(excessData);
                             response.json(excessData);
                            //  fs.writeFile("../components/ReportData.json", 
                            //       JSON.stringify(excessData), function(err) {
                            //      if (err) {
                            //          throw err;
                            //      }
                            //  });
                        }
                        else {
                          console.log(err);
                        }
                    });
                }
                else {
                    response.send(err);
                }
            });
            //console.log(endList);
        }
        else {
            response.send(err);
        }
    });
    client.end;
});

/**
 * @function 'addonsreport' - GET function to return addons report between two dates 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.get('/addonsreport',async(request,response)=> {
    // startdate: 2022-09-09
    
    //getting most recent date from database
    var max = await client.query("SELECT MAX(id) as max_ids FROM addons_requests"); 
   
    var id = max.rows[0].max_ids;
    
    var data = await client.query("select * from addons_requests where id = " + id); 
    var b  = data.rows[0];
    delete b.id;
    

    //doing calculations
    const query = {
        text: "select * from AddOns_History_copy where date >= '" +  
                      b.startdate + "' and date <= '" + b.enddate + "';",
        rowMode: 'array'
    };
    client.query(query, (err,result) => {
        if(!err) {
            const data = result.rows;
            const fields = result.fields.map(field => field.name);
            var addonMap = new Map();
            report = [];
            data.forEach(row => { 
                var i=0;
                for (i=1;i<fields.length;i++) {
                    jsondata = {};
                    let val = addonMap.get(fields[i]);
                    if (val == null) {
                            addonMap.set(fields[i],row[i]);
                    }
                    else {
                            addonMap.set(fields[i],row[i]+val);
                    }
                }
            });
            for (i=1;i<fields.length;i++) {
                jsondata = {};
                let val = addonMap.get(fields[i]);
                jsondata['addonname'] = fields[i];
                if (val == null)
                    val = 0;
                jsondata['addonamount'] = val;
                report.push(jsondata);
            }
// console.log(report);
            response.json(report);
            // fs.writeFile("../components/ReportData.json", JSON.stringify(report), function(err) {
            //     if (err) {
            //         throw err;
            //     }
            // })
        }
        else {
            console.log(err);
        }
    });
    client.end;
});

/**
 * @function 'editminimumvalue' - POST function to set minimum value of an ingredient 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.post('/editminimumvalue', (request,response)=> {
      const b = request.body;
      var query = "update inventory set minimumamount=" + b.minimumvalue
                + " where ingredient='" + b.ingredient + "';";
      //console.log(query);
      client.query(query, (err,result) => {
          if(!err) {
              console.log("Edited minimum value successfully");
              response.send('success');
          }
          else {
              console.log(err);
              response.send('failed');
          }
      });
      client.end;
});

/**
 * @function 'updateaddons' - POST function to increment the addons 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.post('/updateaddons', (request,response)=> {
      const b = request.body;
      var query = "select * from addons_history_copy where date= '" + b.date + "';";

      client.query(query, (err,result) => {
          if(!err) {
              console.log('Successfully updated addons - 1');
          }
          else {
              console.log(err);
          }
      });
      query = "update addons_history_copy set " + b.ingredient + "=" + b.ingredient + "+" + 1 + " where date='"
                + date
                + "';";
      client.query(query, (err,result) => {
          if(!err) {
              console.log('Successfully updated addons - 2');
              response.send('success');
          }
          else {
              console.log(err);
              response.send('failed');
          }
      });
      client.end;
});

/**
 * @function 'getingredientlist' - GET function to obtain ingredient list 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.get('/getingredientlist', (request,response)=> {
    var q = "select ingredient from inventory;"; 
    inventory = [];
    client.query(q, (err,result) => {
        if(!err) {
           var i = 0;
           var data = result.rows;
           data.forEach(row =>  { 
                 inventory[i++] = row.ingredient;
           });
           response.json(inventory);
        }
        else {
              console.log(err);
              response.send('failed');
        }
    });
    client.end;
});

/**
 * @function 'getmenuitemlist' - Get function to obtain list of menu items 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.get('/getmenuitemlist', (request,response)=> {
    var q = "select itemname from menu_items;"; 
    inventory = [];
    client.query(q, (err,result) => {
        if(!err) {
           var i = 0;
           var data = result.rows;
           data.forEach(row =>  { 
                 inventory[i++] = row.itemname;
           });
//console.log(inventory);
           response.json(inventory);
        }
        else {
           console.log(err);
           response.send('failed');
        }
    });
    client.end;
});

/**
 * @function 'addnewmenuitem' - POST function to create a new menu item with price and ingredients 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.post('/addnewmenuitem', (request,response)=> {
    const b = request.body;
//console.log(b);
    var q = "INSERT into menu_items (" + 
            "itemname, itemprice, itemtype) VALUES ('"
                         + b.itemname + "',"
                         + b.itemprice + ",'"
                         + b.itemtype  + "');" 
//console.log(q);
    client.query(q, (err,result) => {
          if(!err) {
             q = "select * from ingredient_map;"; 
             //console.log(q);
             client.query(q, (err,result) => {
                if(!err) {
                    const fields = result.fields.map(field => field.name);
                    var ingrdata = b.ingrdata;
                    var i = 0;
                    insertq = "INSERT into ingredient_map (itemname,"; 
                    valueq  = "VALUES (" + "'" + b.itemname + "'" +  ",";
                    for (i = 1; i < fields.length; i++) {
                        var j = 0;
                        var val = 0.0;
                        for (j = 0; j < ingrdata.length; j++) {
                            val = 0.0;
                            if(!fields[i].localeCompare(ingrdata[j].ingrname)) {
                                val = ingrdata[j].ingramount; 
                                break;
                            }
                        }
                        insertq += fields[i];
                        valueq  += val;
                        //console.log(fields[i] + '=' + val);
                        if ( i != fields.length-1) {
                           insertq += ",";
                           valueq += ",";
                        }
                    }
                    insertq += ") ";
                    valueq  += ");";
                    q = insertq + valueq;
                    console.log(q);
                    client.query(q, (err,result) => {
                       if(!err)
                           response.send('success');
                       else
                           response.send('failed');
                    });
                }
                else
                    response.send('failed');
             });
          }
          else {
             console.log(err);
             response.send('failed');
          }
    });
    client.end;
});

/**
 * @function 'addnewingredient' - POST function to create a new ingredient in inventory and ingredient_map tables 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.post('/addnewingredient', (request,response)=> {
    const b = request.body;
    var q = "INSERT into inventory (" + 
                         "ingredient, ingredientremaining, amountused,minimumamount) VALUES ('"
                         + b.ingredient    + "'" + ","  
                         + b.itemamount    + "," 
                         + 0.0    + "," 
                         + b.itemminamount + ");" 
    //console.log(q);
    client.query(q, (err,result) => {
        if(!err) {
             q = "alter table ingredient_map add " + b.ingredient + " INT DEFAULT 0";
             client.query(q, (err,result) => {
                 if(!err) {
                     q = "alter table addons_history_copy add " + b.ingredient + " INT DEFAULT 0";
                     client.query(q, (err,result) => {
                        if(!err) {
                            q = "alter table inventory_history_copy add " + b.ingredient + " INT DEFAULT 0";
                            client.query(q, (err,result) => {
                               if(!err) {
                                   console.log("added ingredient " + b.ingredient + "to ingredient_map");
                                   response.send('success');
                               }
                               else {
                                   console.log("0. failed to added ingredient " + b.ingredient + "to ingredient_map");
                                   console.log(err);
                                   response.send('failed');
                               }
                           });
                        }
                        else {
                            console.log("1. failed to add ingredient " + b.ingredient + "to ingredient_map");
                            console.log(err);
                            response.send('failed');
                        }
                     });
                 }
                 else {
                      console.log("2. failed to add ingredient " + b.ingredient + "to ingredient_map");
                      console.log(err);
                      response.send('failed');
                 }
             });
          }
          else {
             console.log("3. failed to add ingredient " + b.ingredient + "to ingredient_map");
             console.log(err);
             response.send('failed');
          }
    });
    client.end;
});

/**
 * @function 'deleteingredient' - POST function to delete an ingredient 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.post('/deleteingredient', (request,response)=> {
    const b = request.body;
    var query =  "Select "+ b.ingredient+" from ingredient_map;";
    var q = {
        text: query,
        rowMode: 'array'
    };
    // Check if the ingredient is used
    client.query(q, (err,result) => {
        if(!err) {
            var ingredientUsed = 0;
            // If any of this ingredient value is not 0.0, then we will not remove
            // and return with 'failed' status
            var data = result.rows;
            data.forEach(row => { 
                  if(row[0] != 0)
                     ++ingredientUsed;
            });
            if(ingredientUsed == 0) {
                // ingredient is not used by any menu item
                // now drop this column from ingredient map
                query = "ALTER table ingredient_map drop column "+ b.ingredient+";";
                client.query(query, (err,result) => {
                    if(!err) {
                       // now drop this entry from the inventory table
                        query = "DELETE from inventory where ingredient='"+ b.ingredient +"';";
                        client.query(query, (err,result) => {
                            if(!err) {
                               response.send('success');
                            }
                            else {
                                console.log('ingredient could not be removed from ingredient map');
                                response.send('failed');
                            }
                        });
                    }
                    else {
                        console.log('ingredient could not be removed from ingredient map');
                        response.send('failed');
                    }
                });
            }
            else {
                console.log('ingredient is used');
                response.send('failed');
            }
        }
        else {
            console.log('Failed to run query select ingredient form ingredient map');
            response.send('failed');
        }
    });
    client.end;
});

/**
 * @function 'restockitem' - POST function to update the remaining value of an ingredient 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.post('/restockitem', (request,response)=> {
    const b = request.body;
    var q = "update inventory set ingredientremaining=ingredientremaining+" + b.itemamount
                + " where ingredient='" + b.ingredient + "';";
    //console.log(q);
    client.query(q, (err,result) => {
          if(!err) {
             response.json(['success']);
          }
          else
             response.json(['failed']);
    });
    client.end;
});

/**
 * @function 'editmenuitemprice' - POST function to set the price of a menu item 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.post('/editmenuitemprice', (request,response)=> {
    const b = request.body;
    var q = "UPDATE menu_items SET itemprice = " + b.itemprice + " WHERE "
                + "itemname = " + "'" + b.itemname + "';";
    //console.log(q);
    client.query(q, (err,result) => {
          if(!err) {
             response.send('success');
          }
          else
             response.send('failed');
    });
    client.end;
});
/**
 * @function 'editminimumvalue' - GET function to return ingredient remaining value of an ingredient 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.get('/ingredientinstock', (request,response)=> {
    const b = request.body;
    var q = "SELECT ingredientremaining FROM inventory WHERE ingredient = '" + b.ingredient + "';";
    client.query(q, (err,result) => {
          if(!err) {
             jsondata = {}
             jsondata.remaining = result.rows.length;
             response.json(jsondata);
          }
    });
    client.end;
});

/**
 * @function 'inventory' - GET function to return inventory of ingredients 
 * @param  {Request} request - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} response - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.get('/inventory', (request,response)=> {
    var fs = require('fs');
    client.query(`Select * from inventory`, (err,result) => {
        if(!err) {
            const data = result.rows;
            // var  retStr = '';
            // data.forEach(row =>  retStr += `${row.ingredient} ${row.ingredientremaining}
            //                                 ${row.amountused} ${row.minimumamount}` + '<br>');
            // response.send(retStr);

            inventory = [];
            data.forEach(row => {   jsondata = {};
                                    jsondata["ingredient"] = row.ingredient;
                                    jsondata["ingredientremaining"] = row.ingredientremaining;
                                    jsondata["amountused"] = row.amountused;
                                    jsondata["minimumamount"] = row.minimumamount;
                                    inventory.push(jsondata);
                                });
            
            response.json(inventory);
            // fs.writeFile("../components/InventoryData.json", JSON.stringify(inventory), function(err) {
            //     if (err) {
            //         throw err;
            //     }
            // })
        }
    });
    client.end;
});

/**
 * @function 'salesDates' - POST function to return sales requests between start date and end date 
 * @param  {Request} req - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} res - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.post("/salesDates", async(req,res) => {
    try{
        var data = req.body;
        var max = await client.query("SELECT MAX(id) as max_ids FROM sales_requests"); 
        var id = max.rows[0].max_ids + 1;

        var query = "insert into sales_requests(id, startdate, enddate) VALUES (" + id + ", '" + data.startdate+ "', '" + data.enddate + "')";
        var insert = await client.query(query);
        res.json(id);

    }catch (err){
        console.error("Error in customerAPI: /salesDates");
    }
});

/**
 * @function 'addonsDates' - POST function to insert into add on requests table between start date and end date 
 * @param  {Request} req - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} res - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.post("/addonsDates", async(req,res) => {
    try{
        var data = req.body;
        var max = await client.query("SELECT MAX(id) as max_ids FROM addons_requests"); 
        var id = max.rows[0].max_ids + 1;

        var query = "insert into addons_requests(id, startdate, enddate) VALUES (" + id + ", '" + data.startdate+ "', '" + data.enddate + "')";
        var insert = await client.query(query);
        res.json(id);

    }catch (err){
        console.error("Error in customerAPI: /addonsDates");
        console.error(err.message);

    }
});

/**
 * @function 'excessDates' - POST function to excess_requests table from start date till today 
 * @param  {Request} req - Object represents the HTTP request and has properties for the request query string
 * @param  {Response} res - Object that has HTTP response that an Express app sends when it gets an HTTP
 * @return {void} 
 */
app.post("/excessDates", async(req,res) => {
    try{
        var data = req.body;
        var max = await client.query("SELECT MAX(id) as max_ids FROM excess_requests"); 
        var id = max.rows[0].max_ids + 1;

        var query = "insert into excess_requests(id, startdate) VALUES (" + id + ", '" + data.startdate+ "')";
        var insert = await client.query(query);
        res.json(id);

    }catch (err){
        console.error("Error in customerAPI: /addonsDates");
        console.error(err.message);

    }
});

