import React, { Component } from 'react';
import './ManagerWindow.css';
import { Table } from './Table';
import { useNavigate } from "react-router-dom";

function ManagerWindow() {
    // render() { 
    const navigate = useNavigate();

    const handleAddons = async (event, nameStr) => {
        let timeinput = prompt("Enter Start Time and End Time (MM/DD/YYYY MM/DD/YYYY)");
        if (timeinput != null) {
            // OK button is pressed so timeinput is not null
            // split the input and get start date and end date
            let  timeperiods = timeinput.split(" ");
            var  startdate = timeperiods[0];
            var  enddate = timeperiods[1];

            // Create a JSON object 'sendData' (name: value) format
            const sendData = {startdate,enddate};

            const requestURL = "http://localhost:3300/addonsreport";
            const request = new Request(requestURL);

            const response = await fetch(request, {
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                },
                mode: 'cors', 
                body: JSON.stringify(sendData)
            });
            const jsondata = await response.json();
console.log(jsondata);
            let titleStr = "";
            titleStr += "This report shows the quantity of ingredients added on to customized orders between ";
            titleStr += startdate + " and " + enddate;
            var i = 0;
            var data = '<table border="1px solid black"> <th> Add Ons added to Customized Order </th> <th> Amount Added On </th>';
            for (i=0; i < jsondata.length; i++) {
                data += '<tr>';
                data += '<td>' + jsondata[i].addonname + '</td>';
                data += '<td>' + jsondata[i].addonamount + '</td>';
                data += '</tr>';
            }
            data += '</table>';

            const winHtml = `<!DOCTYPE html>
                <html>
                <head>
                    <title>Restock Window</title>
                </head>
                <body>`
                    + '<p>' + titleStr + '<br>' + data + '</p>' + 
                `</body>
                <div name"mytable">
                </div>
            </html>`;

            const winUrl = URL.createObjectURL( new Blob([winHtml], { type: "text/html" }));

            const win = window.open( winUrl, "win", `width=800,height=400,screenX=200,screenY=200`);
            if (window.focus())
                win.focus();
        }
    }

    const handleEditMenuItem = async () => {
        const requestURL = "http://localhost:3300/getmenuitemlist";
        const request = new Request(requestURL);

        const response = await fetch(request, {
            method: 'GET', 
            headers: { 
                'Content-Type': 'application/json',
            },
            mode: 'cors', 
        });
        const jsondata = await response.json();
        var select = document.getElementById("edit-menu-items"); 

        for(var i = 1; i < jsondata.length; i++) {
            var opt = jsondata[i];

            var el = document.createElement("option");
            el.text = opt;
            el.value = opt;

            select.add(el);
        }
    }

    const handleIngrList = async () => {
        const requestURL = "http://localhost:3300/getingredientlist";
        const request = new Request(requestURL);

        const response = await fetch(request, {
            method: 'GET', 
            headers: { 
                'Content-Type': 'application/json',
            },
            mode: 'cors', 
        });
        const jsondata = await response.json();
        var select = document.getElementById("restock-menu-items"); 

        for(var i = 1; i < jsondata.length; i++) {
            var opt = jsondata[i];

            var el = document.createElement("option");
            el.text = opt;
            el.value = opt;

            select.add(el);
        }
    }
        const handleAddNewMenuItem = async (event, nameStr) => {
            var e = document.getElementById("new-menu-item-name");
            var itemname = e.value;

            e = document.getElementById("new-menu-item-price");
            var itemprice = e.value;

            e = document.getElementById("new-menu-item-type");
            var itemtype = e.value;

            e = document.getElementById("new-menu-item-ingr");
            var itemsmaparray = e.value.split(",");
            var ingrdata   = [];
            var i=0;
            for (i=0; i < itemsmaparray.length; i++) {
               var ingr = itemsmaparray[i].split(" ");
               var ingrmap = {};
               var ingramount = ingr[0];
               var ingrname = ingr[1];
               ingrmap['ingrname'] = ingrname;
               ingrmap['ingramount'] = ingramount;
               ingrdata.push(ingrmap);
            }
            const sendData = {itemname,itemprice,itemtype,ingrdata};
            //console.log(sendData);
            // Create a request URL to send to the server
            const requestURL = "http://localhost:3300/addnewmenuitem";
            const request = new Request(requestURL);

            // Send the request along with the data inside 'request body'
            const response = await fetch(request, {
                method: 'POST', 
                headers: { 
                        'Content-Type': 'application/json',
                },
                mode: 'cors', 
                body: JSON.stringify(sendData)
            });
            // Now obtain the data from server.  Server sent a text so read it as text
            const status = await response.text();
            if(status == 'success')
               alert('successfully added new menu item - '+itemname+', price to ' + itemprice);
            else
               alert('Failed to added new menu item - '+itemname+', price to ' + itemprice);
        }
        const handleSetEditMenuItem = async (event, nameStr) => {
            var e = document.getElementById("edit-menu-items");
            var itemname = e.value;

        e = document.getElementById("edit-item-price");
        var itemprice = e.value;

        const sendData = {itemname,itemprice};
console.log(sendData);
        // Create a request URL to send to the server
        const requestURL = "http://localhost:3300/editmenuitemprice";
        const request = new Request(requestURL);

        // Send the request along with the data inside 'request body'
        const response = await fetch(request, {
            method: 'POST', 
            headers: { 
                    'Content-Type': 'application/json',
            },
            mode: 'cors', 
            body: JSON.stringify(sendData)
        });
        // Now obtain the data from server.  Server sent a text so read it as text
        const status = await response.text();
        if(status == 'success')
            alert('successfully changed menu item - '+itemname+', price to ' + itemprice);
        else
            alert('Failed to change menu item - '+itemname+', price to ' + itemprice);
    }

    const handleNewIngredient = async (event, nameStr) => {
        var e = document.getElementById("new-ingredient-name");
        var ingredient = e.value;

        e = document.getElementById("new-ingredient-amount");
        var itemamount = e.value;

        e = document.getElementById("new-ingredient-minamount");
        var itemminamount = e.value;

        const sendData = {ingredient,itemamount,itemminamount};
console.log(sendData);
        // Create a request URL to send to the server
        const requestURL = "http://localhost:3300/addnewingredient";
        const request = new Request(requestURL);

        // Send the request along with the data inside 'request body'
        const response = await fetch(request, {
            method: 'POST', 
            headers: { 
                    'Content-Type': 'application/json',
            },
            mode: 'cors', 
            body: JSON.stringify(sendData)
        });
        const status = await response.text();
        if(status == 'success')
            alert('successfully added new ingredient - '+ ingredient);
        else
            alert('failed to add new ingredient - '+ ingredient);
    }

    const handleRestockItem = async (event, nameStr) => {
        var e = document.getElementById("restock-menu-items");

        var ingredient = e.value;
        e = document.getElementById("restock-item-amount");

        var itemamount = e.value;
        const sendData = {ingredient,itemamount};
console.log(sendData);
        // Create a request URL to send to the server
        const requestURL = "http://localhost:3300/restockitem";
        const request = new Request(requestURL);

        // Send the request along with the data inside 'request body'
        const response = await fetch(request, {
            method: 'POST', 
            headers: { 
                    'Content-Type': 'application/json',
            },
            mode: 'cors', 
            body: JSON.stringify(sendData)
        });
        // Now obtain the data from server.  Server sent a text so read it as text
        const jsondata = await response.json();
    }

    const handleRestock = async (event, nameStr) => {
        const requestURL = "http://localhost:3300/restock";
        const request = new Request(requestURL);

        await fetch(request, {
    	    method: 'GET', 
                headers: { 
                    'Content-Type': 'application/json',
                },
                mode: 'cors', 
        });
        // const jsondata = await response.json();
        // var i = 0;
        // let titleStr = "";
        // titleStr += "This Restock Report";
        // var i = 0;
        // var data = '<table border="1px solid black"> <th> Ingredient </th> <th> Ingredient Remaining </th>';
        // for (i=0; i < jsondata.length; i++) {
        //             data += '<tr>';
        //             data += '<td>' + jsondata[i].ingredient + '</td>';
        //             data += '<td>' + jsondata[i].ingredientremaining + '</td>';
        //             data += '</tr>';
        // }
        // data += '</table>';

        // const winHtml = `<!DOCTYPE html>
        //                 <html>
        //                 <head>
        //                     <title>Restock Window</title>
        //                 </head>
        //                 <body>`
        //                 + '<p>' + titleStr + '<br>' + data + '</p>' + 
        //                 `</body>
        //                 <div name"mytable">
        //                 </div>
        //                 </html>`;

        // const winUrl = URL.createObjectURL( new Blob([winHtml], { type: "text/html" }));

        // const win = window.open( winUrl, "win", `width=800,height=400,screenX=200,screenY=200`);
        // if (window.focus())
        //     win.focus();

        navigate("/restock");
    }

    // Client code to process 'Sales' when user clicks on 'sales' button
    const handleSales = async (event, nameStr) => {
        // Read the input from propmpt window
        // It is a text field and user will enter '11/01/2022 11/09/2022'

        let timeinput = prompt("Enter Start Time and End Time (MM/DD/YYYY MM/DD/YYYY)");
        if (timeinput != null) {
            // OK button is pressed so timeinput is not null
            // split the input and get start date and end date
            let  timeperiods = timeinput.split(" ");
            var  startdate = timeperiods[0];
            var  enddate = timeperiods[1];

            // Create a JSON object 'sendData' (name: value) format
            const sendData = {startdate,enddate};

            // Create a request URL to send to the server
            const requestURL = "http://localhost:3300/sales";
            const request = new Request(requestURL);

            // Send the request along with the data inside 'request body'
            const response = await fetch(request, {
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                },
                mode: 'cors', 
                body: JSON.stringify(sendData)
            });
            // Now obtain the data from server.  Server sent a text so read it as text
            const jsondata = await response.json();
            let titleStr = "";
            titleStr += "This report shows the order sales between ";
            titleStr += startdate + " and " + enddate;
            var i = 0;
            var data = '<table border="1px solid black"> <th>OrderName</th> <th>Order ID</th> <th>LineItem</th> <th>ItemName</th> <th>ItemPrice</th> <th>OrderDay</th> <th>OrderMonth</th> <th>OrderYear</th>';
            for (i=0; i < jsondata.length; i++) {
                    data += '<tr>';
                    data += '<td>' + jsondata[i].orderpk    + '</td>';
                    data += '<td>' + jsondata[i].orderid    + '</td>';
                    data += '<td>' + jsondata[i].lineitem   + '</td>';
                    data += '<td>' + jsondata[i].itemname   + '</td>';
                    data += '<td>' + jsondata[i].itemprice  + '</td>';
                    data += '<td>' + jsondata[i].orderday   + '</td>';
                    data += '<td>' + jsondata[i].ordermonth + '</td>';
                    data += '<td>' + jsondata[i].orderyear  + '</td>';
                    data += '</tr>';
            }
            data += '</table>';
            const winHtml = `<!DOCTYPE html>
                        <html>
                        <head>
                            <title>Restock Window</title>
                        </head>
                        <body>`
                        + '<p>' + titleStr + '<br>' + data + '</p>' + 
                        `</body>
                        <div name"mytable">
                        </div>
                        </html>`;

            const winUrl = URL.createObjectURL( new Blob([winHtml], { type: "text/html" }));

            const win = window.open( winUrl, "win", `width=800,height=400,screenX=200,screenY=200`);
            if (window.focus())
                win.focus();
        }
    }

    const handleExcess = async (event, nameStr) => {
        // Read the input from propmpt window
        // It is a text field and user will enter '11/01/2022 11/09/2022'

        let timeinput = prompt("Enter Start Time and End Time (MM/DD/YYYY MM/DD/YYYY)");
        if (timeinput != null) {
            // OK button is pressed so timeinput is not null
            // split the input and get start date and end date
            let  timeperiods = timeinput.split(" ");
            var  startdate = timeperiods[0];
            var  enddate = timeperiods[1];

            // Create a JSON object 'sendData' (name: value) format
            const sendData = {startdate,enddate};

            // Create a request URL to send to the server
            const requestURL = "http://localhost:3300/excess";
            const request = new Request(requestURL);

            // Send the request along with the data inside 'request body'
            const response = await fetch(request, {
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                },
                mode: 'cors', 
                body: JSON.stringify(sendData)
            });
            // Now obtain the data from server.  Server sent a text so read it as text
            const recvData = await response.text();
            let titleStr = "";
            titleStr += "This report shows the excess data between ";
            titleStr += startdate + " and " + enddate;
            // Excess report will come as list of strings.
            const winHtml = `<!DOCTYPE html>
                        <html>
                        <head>
                            <title>Restock Window</title>
                        </head>
                        <body>`
                        + '<p>' + titleStr + '<br>' +'<br>'+ recvData + '</p>' + 
                        `</body>
                        <div name"mytable">
                        </div>
                        </html>`;

            const winUrl = URL.createObjectURL( new Blob([winHtml], { type: "text/html" }));

            const win = window.open( winUrl, "win", `width=800,height=400,screenX=200,screenY=200`);
            if (window.focus())
                win.focus();
        }
        // Client code to process 'Sales' when user clicks on 'sales' button
        const handleSales = async (event, nameStr) => {
            // Read the input from propmpt window
            // It is a text field and user will enter '11/01/2022 11/09/2022'

            let timeinput = prompt("Enter Start Time and End Time (MM/DD/YYYY MM/DD/YYYY)");
            if (timeinput != null) {
                // OK button is pressed so timeinput is not null
                // split the input and get start date and end date
                let  timeperiods = timeinput.split(" ");
                var  startdate = timeperiods[0];
                var  enddate = timeperiods[1];

                // Create a JSON object 'sendData' (name: value) format
                const sendData = {startdate,enddate};

                // Create a request URL to send to the server
                const requestURL = "http://localhost:3300/sales";
                const request = new Request(requestURL);

                // Send the request along with the data inside 'request body'
                const response = await fetch(request, {
                    method: 'POST', 
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors', 
                    body: JSON.stringify(sendData)
                });
                // Now obtain the data from server.  Server sent a text so read it as text
                const jsondata = await response.json();
                let titleStr = "";
                titleStr += "This report shows the order sales between ";
                titleStr += startdate + " and " + enddate;
                var i = 0;
                var data = '<table border="1px solid black"> <th>OrderName</th> <th>Order ID</th> <th>LineItem</th> <th>ItemName</th> <th>ItemPrice</th> <th>OrderDay</th> <th>OrderMonth</th> <th>OrderYear</th>';
                for (i=0; i < jsondata.length; i++) {
                        data += '<tr>';
                        data += '<td>' + jsondata[i].orderpk    + '</td>';
                        data += '<td>' + jsondata[i].orderid    + '</td>';
                        data += '<td>' + jsondata[i].lineitem   + '</td>';
                        data += '<td>' + jsondata[i].itemname   + '</td>';
                        data += '<td>' + jsondata[i].itemprice  + '</td>';
                        data += '<td>' + jsondata[i].orderday   + '</td>';
                        data += '<td>' + jsondata[i].ordermonth + '</td>';
                        data += '<td>' + jsondata[i].orderyear  + '</td>';
                        data += '</tr>';
                }
                data += '</table>';
                const winHtml = `<!DOCTYPE html>
                            <html>
                            <head>
                                <title>Restock Window</title>
                            </head>
                            <body>`
                            + '<p>' + titleStr + '<br>' + data + '</p>' + 
                            `</body>
                            <div name"mytable">
                            </div>
                            </html>`;

                const winUrl = URL.createObjectURL( new Blob([winHtml], { type: "text/html" }));

                const win = window.open( winUrl, "win", `width=800,height=400,screenX=200,screenY=200`);
                if (window.focus())
                    win.focus();
            }
        }
        const handleExcess = async (event, nameStr) => {
            // Read the input from propmpt window
            // It is a text field and user will enter '11/01/2022 11/09/2022'

            let timeinput = prompt("Enter Start Time and End Time (MM/DD/YY MM/DD/YY)");
            if (timeinput != null) {
                // OK button is pressed so timeinput is not null
                // split the input and get start date and end date
                let  timeperiods = timeinput.split(" ");
                var  startdate = timeperiods[0];
                var  enddate = timeperiods[1];

                // Create a JSON object 'sendData' (name: value) format
                const sendData = {startdate,enddate};

                // Create a request URL to send to the server
                const requestURL = "http://localhost:3300/excess";
                const request = new Request(requestURL);

                // Send the request along with the data inside 'request body'
	            const response = await fetch(request, {
			        method: 'POST', 
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors', 
                    body: JSON.stringify(sendData)
                });
                // Now obtain the data from server.  Server sent a text so read it as text
                const recvData = await response.text();
                let titleStr = "";
                titleStr += "This report shows the excess data between ";
                titleStr += startdate + " and " + enddate;
                // Excess report will come as list of strings.
                const winHtml = `<!DOCTYPE html>
                            <html>
                            <head>
                                <title>Restock Window</title>
                            </head>
                            <body>`
                            + '<p>' + titleStr + '<br>' +'<br>'+ recvData + '</p>' + 
                            `</body>
                            <div name"mytable">
                            </div>
                            </html>`;

                const winUrl = URL.createObjectURL( new Blob([winHtml], { type: "text/html" }));

                const win = window.open( winUrl, "win", `width=800,height=400,screenX=200,screenY=200`);
                if (window.focus())
                    win.focus();
            }

        }
              
    }

    return (
        <section className='ManagerWindow'>
            <div className='left-half'>
                <h1>Inventory</h1>
                <Table columnType={'inventory'} dataType={'inventory'} />
            </div>
            <div className='right-half'>
                <div className="report-btn-group">
                    <button onClick={event => handleSales(event,'sales')} className="role-button">Sales</button>
                    <button onClick={event => handleExcess(event,'excess')} className="role-button">Excess</button>
                    <button onClick={event => handleRestock(event,'restock')} className="role-button">Restock</button>
                    {/* <button onClick={event => handleRestock(event, 'restock')} className="role-button">Restock</button> */}
                    <button onClick={event => handleAddons(event,'addons')} className="role-button">Add-ons</button>
                </div>
                    <h2>Add Menu Item</h2>
                    <div className='add-menu-item'>
                        <div className='input-class'>
                            <form>
                                <label>
                                    <input type="text" id="new-menu-item-name" placeholder="Enter menu item name" />
                                    <br></br>
                                    <input type="text" id="new-menu-item-price" placeholder="Enter menu item price" />
                                    <br></br>
                                    <p class="textcolorwhite">Enter ingredients like (3 buns,4 onions,10 cheese):</p>
                                    <input type="text" id="new-menu-item-ingr" placeholder="Enter menu item ingredients" />
                                    <br></br>
                                    <p class="textcolorwhite">Menu Item Type</p>
                                    <select name='new-menu-item-type' id='new-menu-item-type' >
                                        <option>Sandwich</option>
                                        <option>Side</option>
                                        <option>Burger</option>
                                        <option>Soup</option>
                                        <option>Salad</option>
                                        <option>Basket</option>
                                    </select>
                                </label>
                            </form>
                        </div>
                        <div className='submit-class'>
                            <button onClick={event => handleAddNewMenuItem(event,'menu-item')} className='submit-btn'>+</button>
                        </div>
                    </div> 

                    <h2>Edit Price</h2>
                    <div className='edit-price'>
                        <div className='input-class'>
                            <form>
                                <label>
                                    <select name='edit-menu-items' id='edit-menu-items' onChange={handleEditMenuItem()}>
                                    </select>
                                    <br></br>
                                    <input type="text" name='edit-item-price' id='edit-item-price' placeholder="Enter new menu item price" />
                                    <br></br>
                                </label>
                            </form>
                        </div>
                        <div className='submit-class'>
                            <button onClick={event => handleSetEditMenuItem(event,'menu-item')} className='submit-btn'>+</button>
                        </div>
                    </div>

                <h2>Restock Ingredient</h2>
                <div className='restock-ingredient'>
                    <div className='input-class'>
                        <form>
                            <label>
                                <select name='restock-menu-items' id='restock-menu-items' onChange={handleIngrList()}>
                                </select>
                                <br></br>
                                <input type="text" id="restock-item-amount" placeholder="Enter ingredient quantity" />
                                <br></br>
                            </label>
                        </form>
                    </div>
                    <div className='submit-class'>
                        <button onClick={event => handleRestockItem(event,'restock-item')} className='submit-btn'>+</button>
                    </div>
                </div>

                <h2>Add Ingredient</h2>
                <div className='add-ingredient'>
                    <div className='input-class'>
                        <form>
                            <label>
                                <input type="text" id="new-ingredient-name" placeholder="Enter ingredient name" />
                                <br></br>
                                <input type="text" id="new-ingredient-amount" placeholder="Enter ingredient quantity" />
                                <br></br>
                                <input type="text" id="new-ingredient-minamount" placeholder="Enter ingredient minimum quantity" />
                                <br></br>
                            </label>
                        </form>
                    </div>
                    <div className='submit-class'>
                        <button onClick={event => handleNewIngredient(event,'restock-item')} className='submit-btn'>+</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default ManagerWindow;
