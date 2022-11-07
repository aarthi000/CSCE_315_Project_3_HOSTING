import React, { Component } from 'react';
import './ManagerWindow.css';

class ManagerWindow extends Component {
    state = { 

    };

    render() { 
        return (
            <section className='ManagerWindow'>
                <div className='left-half'>
                    <h1>Inventory</h1>
                </div>
                <div className='right-half'>
                    <div class="report-btn-group">
                        <button class="role-button">Sales</button>
                        <button class="role-button">Excess</button>
                        <button class="role-button">Restock</button>
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