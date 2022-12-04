import React, { Component } from 'react';
import './ManagerWindow.css';
import { Table } from './Table';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Manager() {
    // render() { 
    const navigate = useNavigate();

    const handleAddons = async (event, nameStr) => {
        let timeinput = prompt("Enter Start Time and End Time (YYYY-MM-DD YYYY-MM-DD)");
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

            navigate("/addons");   
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

    const handleIngrList = async (menuname) => {
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
        //var select = document.getElementById("restock-menu-items"); 
        var select = document.getElementById(menuname);

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

    const handleEditMinimumValue = async (event, nameStr) => {
        var e = document.getElementById("editmin-menu-items");

        var ingredient = e.value;
        e = document.getElementById("editmin-item-amount");

        var minimumvalue = e.value;
        const sendData = {ingredient,minimumvalue};
console.log(sendData);
        // Create a request URL to send to the server
        const requestURL = "http://localhost:3300/editminimumvalue";
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

            navigate("/sales");
        }
    }

    const handleExcess = async (event, nameStr) => {
        // Read the input from propmpt window
        // It is a text field and user will enter '11/01/2022 11/09/2022'

        let timeinput = prompt("Enter Start Time (YYYY-MM-DD)");
        if (timeinput != null) {
            // OK button is pressed so timeinput is not null
            // split the input and get start date and end date
            let  timeperiods = timeinput.split(" ");
            var  startdate = timeperiods[0];

            // Create a JSON object 'sendData' (name: value) format
            const sendData = {startdate};

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
            
            navigate("/excess");  
        }
    }

    return (
        <section className='ManagerWindow'>
            <br></br>
            <div className='split left'>
                <h2>Inventory</h2>
                <div className='table'>
                    <Table columnType={'inventory'} dataType={'inventory'} />
                </div>
            </div>
            <div className='split right'>
                <div className="report-btn-group">
                    <button onClick={event => handleSales(event,'sales')} className="role-button">Sales</button>
                    <button onClick={event => handleExcess(event,'excess')} className="role-button">Excess</button>
                    <button onClick={event => handleRestock(event,'restock')} className="role-button">Restock</button>
                    <button onClick={event => handleAddons(event,'addons')} className="role-button">Add-ons</button>
                </div>
                
                <h2>Add Menu Item</h2>
                <div className='add-menu-item'>
                    <div className='input-class'>
                        <form>
                            <label>
                                <select name='new-menu-item-type' id='new-menu-item-type' >
                                    <option>Sandwich</option>
                                    <option>Side</option>
                                    <option>Burger</option>
                                    <option>Soup</option>
                                    <option>Salad</option>
                                    <option>Basket</option>
                                </select>
                                <input type="text" id="new-menu-item-name" placeholder="Enter menu item name" />
                                <br></br>
                                <input type="text" id="new-menu-item-price" placeholder="Enter menu item price" />
                                <br></br>
                                {/* <p class="textcolorwhite">Enter ingredients like (3 buns,4 onions,10 cheese):</p> */}
                                <input type="text" id="new-menu-item-ingr" placeholder="Enter menu item ingredients (e.g., 3 buns,4 onions,10 cheese)" />
                                <br></br>
                                {/* <p class="textcolorwhite">Menu Item Type</p> */}  
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
                                <select name='restock-menu-items' id='restock-menu-items' onChange={handleIngrList('restock-menu-items')}>
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

                <h2>Edit Minimum Value</h2>
                <div className='edit-minimum-value'>
                    <div className='input-class'>
                        <form>
                            <label>
                                <select name='editmin-menu-items' id='editmin-menu-items' onChange={handleIngrList('editmin-menu-items')}>
                                </select>
                                <br></br>
                                <input type="text" id="editmin-item-amount" placeholder="Enter Minimum Value" />
                                <br></br>
                            </label>
                        </form>
                    </div>
                    <div className='submit-class'>
                        <button onClick={event => handleEditMinimumValue(event,'edit-minimum-value')} className='submit-btn'>+</button>
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

export default Manager;
