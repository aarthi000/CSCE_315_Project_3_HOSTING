const client = require('./connection.js');
const express = require('express');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
client.connect();

app.listen(3300, () => {
    console.log("Server is now listening at port 3300");
});

app.use(function(request,response,next) {
    response.header("Content-Type", "application/json");
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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
            fs.writeFile("../components/ReportData.json", JSON.stringify(inventory), function(err) {
                if (err) {
                    throw err;
                }
            })
        }
    });
    client.end;
});

app.post('/sales', (request,response)=> {
    var fs = require('fs');
    const b = request.body;

                //const queryObject = url.parse(request.url, true).query;
                //console.log(queryObject.startdate);
                //console.log(queryObject.enddate);
                //let starttime = '9/18/2022';
                //let endtime = '9/24/2022';

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

            console.log(itemSales);

            Array.from(itemSales.keys()).forEach(itemName => {
                salesrow = {}
                salesrow["itemname"] = itemName;
                salesrow["amountsold"] = itemSales.get(itemName);
                salesdata.push(salesrow);
            });
    // console.log(salesdata);
            response.json(salesdata);
            fs.writeFile("../components/ReportData.json", JSON.stringify(salesdata), function(err) {
                if (err) {
                    throw err;
                }
            })
        }
        else {
            response.send(err);
        }
    });

    client.end;
});

app.post('/excess', (request,response)=> {
    var fs = require('fs');
    const b = request.body;

    let timeRangeQueryStart = "SELECT * FROM inventory_history WHERE date = '" + b.startdate + "';";
    let timeRangeQueryEnd = "SELECT * FROM inventory_history WHERE date = '" + b.enddate + "';";
    const startTimeMap = new Map();
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
            var endList = []; 
            query  =  {
                text: timeRangeQueryEnd,
                rowMode: 'array'
            };
            // Run time end query
            client.query(query, (err,result) => {
                if(!err) {
                    const fields = result.fields.map(field => field.name);
                    const data = result.rows;
                    i = 0;
                    // For each field, just store value in an array
                    data.forEach(row =>  { 
                        for (i=1;i<fields.length;i++) {
                            endList[i] = row[i];
                        }
                    });
                    retStr = '';
                    i = 1;
                    excessData = [];
                    // compare the values and determine the excess
                    for (const [key, value] of startTimeMap) {
                        if(endList[i++] > (0.9 * value )) {
                            retStr += key + '<br>';
                            excessRow = {}
                            excessRow["itemName"] = key;
                            excessData.push(excessRow);
                        } 
                    }
                    response.json(excessData);
                    fs.writeFile("../components/ReportData.json", JSON.stringify(excessData), function(err) {
                        if (err) {
                            throw err;
                        }
                    })
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

var getDaysArray = function(start, end) {
    var i =0;
    var arr = [];
    for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr[i++] = new Date(dt).toISOString();
    }
    return arr;
};

var getDates = function(b) {
      let starttime = b.startdate;
      let endtime   = b.enddate;

      let startDateSplit  = starttime.split("/");
      let startMonth      = startDateSplit[0];
      let startDay        = startDateSplit[1];
      let startYear       = startDateSplit[2];

      let endDateSplit = endtime.split("/");
      let endMonth     = endDateSplit[0];
      let endDay       = endDateSplit[1];
      let endYear      = endDateSplit[2];
      let startStr = startYear+"-"+startMonth+"-"+startDay;
      let endStr   = endYear  +"-"+endMonth  +"-"+endDay;

      //var daylist = getDaysArray( "2018-05-01","2018-05-08");
      var daylist = getDaysArray( startStr, endStr);
      var daylist2 = [];
      for(i=0;i<daylist.length;i++) {
          daylist2[i] = daylist[i].split('T')[0];  
          daylistSplit = daylist2[i].split("-");
          var month = parseInt(daylistSplit[1]);
          var day  = parseInt(daylistSplit[2]);
          var year = daylistSplit[0]-2000;
          daylist2[i] = month+"/"+day+"/"+year;
      }
      return daylist2;
};

app.post('/addonsreport',(request,response)=> {
    var fs = require('fs');
    const b = request.body;
    daylist2 = getDates(b);

    const query = {
        text: "select * from AddOns_History;",
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
                var index=-1;
                if (daylist2.includes(row[0])) {
                    for (i=1;i<fields.length;i++) {
                        jsondata = {};
                        let val = addonMap.get(fields[i]);
                        jsondata['addonname'] = fields[i];
                        if (val == null) {
                            jsondata['addonamount'] = row[i];
                            //addonMap.set(fields[i],row[i]);
                        }
                        else {
                            jsondata['addonamount'] = row[i] + val;
                            //addonMap.set(fields[i],row[i]+val);
                        }
                        report.push(jsondata);
                    }
                }
            });
            //for (const [key, value] of addonMap) {
            //    var addon = key;
            //    var amount = value;
            //    titleStr += "<br>" + addon + "             " + amount;
            //}
            response.json(report);
            fs.writeFile("../components/ReportData.json", JSON.stringify(report), function(err) {
                if (err) {
                    throw err;
                }
            })
        }
        else {
            console.log(err);
        }
    });
    client.end;
});

app.post('/changeminimum', (request,response)=> {
      const b = request.body;
      var query = "update inventory set minimumamount=" + b.minimumvalue
                + " where ingredient='" + b.ingredient + "';";
      client.query(query, (err,result) => {
          if(!err) {
          }
          else {
              console.log(err);
          }
      });
      client.end;
});

app.post('/updateaddons', (request,response)=> {
      const b = request.body;
      var query = "select * from addons_history where date= '" + b.date + "';";

      client.query(query, (err,result) => {
          if(!err) {
              console.log('Successfully updated addons - 1');
          }
          else {
              console.log(err);
          }
      });
      query = "update addons_history set " + b.ingredient + "=" + b.ingredient + "+" + 1 + " where date='"
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

app.get('/getingredientlist', (request,response)=> {
    var q = "select * from ingredient_map;"; 
    inventory = [];
    client.query(q, (err,result) => {
        if(!err) {
           const fields = result.fields.map(field => field.name);
           response.json(fields);
        }
    });
    client.end;
});

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
console.log(inventory);
           response.json(inventory);
        }
    });
    client.end;
});

app.post('/addnewmenuitem', (request,response)=> {
    const b = request.body;
console.log(b);
    var q = "INSERT into menu_items (" + 
            "itemname, itemprice, itemtype) VALUES ('"
                         + b.itemname + "',"
                         + b.itemprice + ",'"
                         + b.itemtype  + "');" 
console.log(q);
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
                    //console.log(q);
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
             response.send('success');
          }
          else
             response.send('failed');
    });
    client.end;
});

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
            fs.writeFile("../components/InventoryData.json", JSON.stringify(inventory), function(err) {
                if (err) {
                    throw err;
                }
            })
        }
    });
    client.end;
});
