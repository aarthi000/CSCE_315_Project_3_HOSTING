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
                </div>
            </section>
        );
    }
}
 
export default ManagerWindow;