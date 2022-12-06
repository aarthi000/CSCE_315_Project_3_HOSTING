import React, { Component, useState } from 'react';
import './ManagerWindow.css';
import { Table } from './Table';
import { useNavigate } from "react-router-dom";
// import Popup from 'reactjs-popup';
// import 'reactjs-popup/dist/index.css';

function Manager() {
    const [status, setStatus] = useState("Operation failed");

    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    const navigate = useNavigate();
    var savedIngrList = [];

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

            // const requestURL = "http://localhost:3300/addonsreport";
            const requestURL = "https://rev-api-manager.onrender.com/addonsreport";

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
        // const requestURL = "http://localhost:3300/getmenuitemlist";
        const requestURL = "https://rev-api-manager.onrender.com/getmenuitemlist";

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
        // const requestURL = "http://localhost:3300/getingredientlist";
        const requestURL = "https://rev-api-manager.onrender.com/getingredientlist";

        const request = new Request(requestURL);

        const response = await fetch(request, {
            method: 'GET', 
            headers: { 
                'Content-Type': 'application/json',
            },
            mode: 'cors', 
        });
        const jsondata = await response.json();
/*
        if(savedIngrList.length != 0  && jsondata.length != 0) {
            if (savedIngrList.sort().join(',') == jsondata.sort().join(','))
               return;
        }
        else
            savedIngrList = JSON.parse(JSON.stringify(jsondata));
*/

        var select = document.getElementById(menuname);
        var options = select.options;

        var values = [];
        for (var k = 0; k < options.length; k++) 
            values.push(options[k].value);

        for(var i = 1; i < jsondata.length; i++) {
            var opt = jsondata[i];

            if (values.length == 0 || !values.includes(opt )) {
               var el = document.createElement("option");
               el.text = opt;
               el.value = opt;

               select.add(el);
            }
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
        // const requestURL = "http://localhost:3300/addnewmenuitem";
        const requestURL = "https://rev-api-manager.onrender.com/addnewmenuitem";

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
        if(status == 'success') {
            alert('successfully added new menu item - '+itemname+', price to ' + itemprice);
            // setStatus("Successfully added new menu item");
        } else {
            alert('Failed to added new menu item - '+itemname+', price to ' + itemprice);
            // setStatus("Failed to add new menu item");
        }
    }

    const handleDeleteIngredient = async () => {

        // const requestURL = "http://localhost:3300/deleteingredient";
        const requestURL = "https://rev-api-manager.onrender.com/deleteingredient";

        const request = new Request(requestURL);

        var e = document.getElementById("delete-ingredient-items");
        var ingredient = e.value;

        if(confirm("Are you sure you want to delete ingredient '" + ingredient + "'?") != true)
        {
            setStatus("Operation canceled");
           return;
        }
        const sendData = {ingredient};
console.log(sendData);
        const response = await fetch(request, {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json',
            },
            mode: 'cors', 
            body: JSON.stringify(sendData)
        });
        const status = await response.text();
        if(status == 'success') {
            setStatus("Successfully deleted ingredient");
        } else {
            setStatus("Failed to delete ingredient");
        }
    }

    const handleSetEditMenuItem = async (event, nameStr) => {
        var e = document.getElementById("edit-menu-items");
        var itemname = e.value;

        e = document.getElementById("edit-item-price");
        var itemprice = e.value;

        const sendData = {itemname,itemprice};
console.log(sendData);
        // Create a request URL to send to the server
        // const requestURL = "http://localhost:3300/editmenuitemprice";
        const requestURL = "https://rev-api-manager.onrender.com/editmenuitemprice";

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
        if(status == 'success') {
            alert('successfully changed menu item - '+itemname+', price to ' + itemprice);
            // setStatus("Successfully edited menu item");
        } else {
            alert('Failed to change menu item - '+itemname+', price to ' + itemprice);
            // setStatus("Failed to edit menu item");
        }
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
        // const requestURL = "http://localhost:3300/addnewingredient";
        const requestURL = "https://rev-api-manager.onrender.com/addnewingredient";

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
        if(status == 'success') {
            alert('successfully added new ingredient - '+ ingredient);
            // setStatus("Successfully added new ingredient");
        } else {
            alert('failed to add new ingredient - '+ ingredient);
            // setStatus("Failed to add new ingredient");
        }

        // Create a request URL to send to the server
        // const requestURLInv = "http://localhost:3300/inventory";
        const requestURLInv = "https://rev-api-manager.onrender.com/inventory";

        const requestInv = new Request(requestURLInv);

        await fetch(requestInv, {
    	      method: 'GET', 
            headers: { 
                'Content-Type': 'application/json',
            },
            mode: 'cors', 
        });
    }

    const handleRestockItem = async (event, nameStr) => {
alert('restock called');
        var e = document.getElementById("restock-menu-items");

        var ingredient = e.value;
        e = document.getElementById("restock-item-amount");

        var itemamount = e.value;
        const sendData = {ingredient,itemamount};
console.log(sendData);
        // Create a request URL to send to the server
        // const requestURL = "http://localhost:3300/restockitem";
        const requestURL = "https://rev-api-manager.onrender.com/restockitem";

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
        // const jsondata = await response.json();
        const status = await response.text();
        if(status == '["success"]') {
            alert('successfully added new ingredient - '+ ingredient);
            // setStatus("Successfully restocked menu item");
        } else {
            alert('failed to add new ingredient - '+ ingredient);
            // setStatus("Failed to restock menu item");
        }

        // Create a request URL to send to the server
        // const requestURLInv = "http://localhost:3300/inventory";
        const requestURLInv = "https://rev-api-manager.onrender.com/inventory";

        const requestInv = new Request(requestURLInv);

        await fetch(requestInv, {
    	      method: 'GET', 
            headers: { 
                'Content-Type': 'application/json',
            },
            mode: 'cors', 
        });
    }

    const handleEditMinimumValue = async (event, nameStr) => {
        var e = document.getElementById("editmin-menu-items");

        var ingredient = e.value;
        e = document.getElementById("editmin-item-amount");

        var minimumvalue = e.value;
        const sendData = {ingredient,minimumvalue};
console.log(sendData);
        // Create a request URL to send to the server
        // const requestURL = "http://localhost:3300/editminimumvalue";
        const requestURL = "https://rev-api-manager.onrender.com/editminimumvalue";

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
        // const jsondata = await response.json();
        const status = await response.text();
        if(status == 'success') {
            alert('successfully added new ingredient - '+ ingredient);
            // setStatus("Successfully edited minimum value");
        } else {
            alert('failed to add new ingredient - '+ ingredient);
            // setStatus("Failed to edit minimum value");
        }

        // Create a request URL to send to the server
        // const requestURLInv = "http://localhost:3300/inventory";
        const requestURLInv = "https://rev-api-manager.onrender.com/inventory";

        const requestInv = new Request(requestURLInv);

        await fetch(requestInv, {
    	      method: 'GET', 
            headers: { 
                'Content-Type': 'application/json',
            },
            mode: 'cors', 
        });
    }

    const handleRestock = async (event, nameStr) => {
        const requestURL = "http://localhost:3300/restock"  ;
        // const requestURL = "https://rev-api-manager.onrender.com/restock";

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
            // const requestURL = "http://localhost:3300/salesDates";
            const requestURL = "https://rev-api-manager.onrender.com/salesDates";

            const request = new Request(requestURL);
            console.log("here 1");

            // Send the request along with the data inside 'request body'
            const response = await fetch(request, {
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                },
                mode: 'cors', 
                body: JSON.stringify(sendData)
            });
            console.log("here 2");

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
            // const requestURL = "http://localhost:3300/excess";
            const requestURL = "https://rev-api-manager.onrender.com/excess";

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
                {/* <Popup open={open} closeOnDocumentClick onClose={closeModal}>
                    <span>{status}</span>
                </Popup> */}

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
                        {/* <Popup trigger={<button onClick={event => handleAddNewMenuItem(event,'menu-item')} className='submit-btn'>+</button>} modal>
                            <span>{status}</span>
                        </Popup> */}

                        <button className='submit-btn'
                            onClick={event => {
                                handleAddNewMenuItem(event,'menu-item');
                                setOpen(o => !o);
                            }}
                        >
                            +
                        </button>
                        {/* <Popup open={open} closeOnDocumentClick onClose={closeModal}>
                            <span>{status}</span>
                        </Popup> */}

                        {/* <button onClick={event => handleAddNewMenuItem(event,'menu-item')} className='submit-btn'>+</button> */}
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
                        {/* <Popup trigger={<button onClick={event => handleSetEditMenuItem(event,'menu-item')} className='submit-btn'>+</button>} modal>
                            {event => handleSetEditMenuItem(event,'menu-item')}
                            <span>{status}</span>
                        </Popup> */}

                        <button className='submit-btn'
                            onClick={event => {
                                handleSetEditMenuItem(event,'menu-item');
                                setOpen(o => !o);
                            }}
                        >
                            +
                        </button>
                        {/* <Popup open={open} closeOnDocumentClick onClose={closeModal}>
                            <span>{status}</span>
                        </Popup> */}

                        {/* <button onClick={event => handleSetEditMenuItem(event,'menu-item')} className='submit-btn'>+</button> */}
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
                        {/* <Popup trigger={<button onClick={event => handleRestockItem(event,'restock-item')} className='submit-btn'>+</button>} modal>
                            <span>{status}</span>
                        </Popup> */}

                        <button className='submit-btn'
                            onClick={event => {
                                handleRestockItem(event,'restock-item');
                                setOpen(o => !o);
                            }}
                        >
                            +
                        </button>
                        {/* <Popup open={open} closeOnDocumentClick onClose={closeModal}>
                            <span>{status}</span>
                        </Popup> */}

                        {/* <button onClick={event => handleRestockItem(event,'restock-item')} className='submit-btn'>+</button> */}
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
                                <input type="text" id="editmin-item-amount" placeholder="Enter minimum value" />
                                <br></br>
                            </label>
                        </form>
                    </div>
                    <div className='submit-class'>
                        {/* <Popup trigger={<button onClick={event => handleEditMinimumValue(event,'edit-minimum-value')} className='submit-btn'>+</button>} modal>
                            <span>{status}</span>
                        </Popup> */}

                        <button className='submit-btn'
                            onClick={event => {
                                handleEditMinimumValue(event,'edit-minimum-value');
                                setOpen(o => !o);
                            }}
                        >
                            +
                        </button>
                        {/* <Popup open={open} closeOnDocumentClick onClose={closeModal}>
                            <span>{status}</span>
                        </Popup> */}
                        
                        {/* <button onClick={event => handleEditMinimumValue(event,'edit-minimum-value')} className='submit-btn'>+</button> */}
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
                        {/* <Popup trigger={<button onClick={event => handleNewIngredient(event,'restock-item')} className='submit-btn'>+</button>} modal>
                            <span>{status}</span>
                        </Popup> */}

                        <button className='submit-btn'
                            onClick={event => {
                                handleNewIngredient(event,'restock-item');
                                setOpen(o => !o);
                            }}
                        >
                            +
                        </button>

                        {/* <button onClick={event => handleNewIngredient(event,'restock-item')} className='submit-btn'>+</button> */}
                    </div>
                </div>
                <h2>Delete Ingredient</h2>
                <div className='delete-ingredient'>
                    <div className='input-class'>
                        <form>
                            <label>
                                <select name='delete-ingredient-items' id='delete-ingredient-items' onChange={handleIngrList('delete-ingredient-items')}>
                                </select>
                                <br></br>
                            </label>
                        </form>
                    </div>
                    <div className='submit-class'>
                        <button className='submit-btn'
                            onClick={event => {
                                handleDeleteIngredient(event,'delete-ingredient');
                                setOpen(o => !o);
                            }}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Manager;
