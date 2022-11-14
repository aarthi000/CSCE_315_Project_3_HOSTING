import React, { Component } from 'react';
import './ManagerWindow.css';

class ManagerWindow extends Component {
    state = { 

    };

    render() { 
        const handleRestock = async (event, nameStr) => {
              const requestURL = "http://localhost:3300/restock";
	      const request = new Request(requestURL);

	      const response = await fetch(request, {
			  method: 'GET', 
                          headers: { 
                            'Content-Type': 'application/json',
                          },
                          mode: 'cors', 
                          });
              const data = await response.json();
              var i = 0;
              for (i = 0; i < data.length; i++) {
                  console.log('ingredient          = ' + data[i].ingredient);
                  console.log('ingredientremaining = ' + data[i].ingredientremaining);
                  console.log('minimumamount       = ' + data[i].minimumamount);
              }
              
              //window.open("http://localhost:3300/restock");
              /* 
                     //console.log('hello' + recvData.portal + '-124');
                     table = '<table>';

                        table += '<th>';
                        table += 'ingredient';
                        table += '</th>
                        table += '<th>';
                        table += 'remaining';
                        table += '</th>
                        
                       
                        while (until last line) {
                           // Get the next line and split the fields
                           /// recvData2= recvData.split(" ");
                           table += '<tr>';
                           table += '<td>';
                           table += recvData2[0];
                           table += '</td>';
                           table += '<td>';
                           table += recvData2[1];
                           table += '</td>';
                           table += '</tr>';
                       }
                     document.insertElement("mytable") = table;
               */ 
 
                      const winHtml = `<!DOCTYPE html>
                                      <html>
                                      <head>
                                         <title>Restock Window</title>
                                      </head>
                                      <body>
                                           <h1>This is the data!</h1>
                                      </body>
                                      <div name"mytable">
                                      </div>
                                      </html>`;

                     const winUrl = URL.createObjectURL( new Blob([winHtml], { type: "text/html" }));

                     const win = window.open( winUrl, "win", `width=800,height=400,screenX=200,screenY=200`);
                     if (window.focus())
                         win.focus();


                     //window.open("http://localhost:3300/sales?" + new URLSearchParams({
                     //      startdate:'${startdate}', enddate: '${enddate}'} ),{ mode: 'no-cors'})
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
                          body: JSON.stringify(sendData)});
                     // Now obtain the data from server.  Server sent a text so read it as text
                     const recvData = await response.json();
                     var i = 0;
                     for (i = 0; i < recvData.length; i++) {
                         console.log("orderpk    = " + recvData[i].orderpk);
                         console.log("orderid    = " + recvData[i].orderid);
                         console.log("lineitem   = " + recvData[i].lineitem);
                         console.log("itemname   = " + recvData[i].itemname);
                         console.log("itemprice  = " + recvData[i].itemprice);
                         console.log("orderday   = " + recvData[i].orderday);
                         console.log("ordermonth = " + recvData[i].ordermonth);
                         console.log("orderyear  = " + recvData[i].orderyear);
                     }
                     // Now process the data and create a 'table' html element  to show in a new window
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
                          body: JSON.stringify(sendData)});
                     // Now obtain the data from server.  Server sent a text so read it as text
                     const recvData = await response.text();
                     // Excess report will come as list of strings.
                 }

        }
              
        return (
            <section className='ManagerWindow'>
                <div className='left-half'>
                    <h1>Inventory</h1>
                </div>
                <div className='right-half'>
                    <div class="report-btn-group">
                        <button onClick={event => handleSales(event,'sales')}class="role-button">Sales</button>
                        <button onClick={event => handleExcess(event,'excess')}class="role-button">Excesss</button>
                        <button onClick={event => handleRestock(event,'restock')}class="role-button">Restock</button>
                        <button class="role-button">Add-ons</button>
                    </div>

                    <h2>Add Menu Item</h2>
                    <div className='add-menu-item'>
                        <div className='input-class'>
                            <form>
                                <label>
                                    <input type="text" placeholder="Enter menu item name" />
                                    <br></br>
                                    <input type="text" placeholder="Enter menu item price" />
                                    <br></br>
                                    <input type="text" placeholder="Enter menu item ingredients" />
                                    <br></br>
                                </label>
                            </form>
                        </div>
                        <div className='submit-class'>
                            <button className='submit-btn'>+</button>
                        </div>
                    </div> 

                    <h2>Edit Price</h2>
                    <div className='edit-price'>
                        <div className='input-class'>
                            <form>
                                <label>
                                    <select name='menu-items'>
                                        <option value='temp1'>temp1</option>
                                        <option value='temp2'>temp2</option>
                                        <option value='temp3'>temp3</option>
                                        <option value='temp4'>temp4</option>
                                        <option value='temp5'>temp5</option>
                                    </select>
                                    <br></br>
                                    <input type="text" placeholder="Enter new menu item price" />
                                    <br></br>
                                </label>
                            </form>
                        </div>
                        <div className='submit-class'>
                            <button className='submit-btn'>+</button>
                        </div>
                    </div>

                    <h2>Restock Ingredient</h2>
                    <div className='restock-ingredient'>
                        <div className='input-class'>
                            <form>
                                <label>
                                    <select name='menu-items'>
                                        <option value='temp1'>temp1</option>
                                        <option value='temp2'>temp2</option>
                                        <option value='temp3'>temp3</option>
                                        <option value='temp4'>temp4</option>
                                        <option value='temp5'>temp5</option>
                                    </select>
                                    <br></br>
                                    <input type="text" placeholder="Enter ingredient quantity" />
                                    <br></br>
                                </label>
                            </form>
                        </div>
                        <div className='submit-class'>
                            <button className='submit-btn'>+</button>
                        </div>
                    </div>

                    <h2>Add Ingredient</h2>
                    <div className='add-ingredient'>
                        <div className='input-class'>
                            <form>
                                <label>
                                    <input type="text" placeholder="Enter ingredient name" />
                                    <br></br>
                                    <input type="text" placeholder="Enter ingredient quantity" />
                                    <br></br>
                                </label>
                            </form>
                        </div>
                        <div className='submit-class'>
                            <button className='submit-btn'>+</button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
export default ManagerWindow;
