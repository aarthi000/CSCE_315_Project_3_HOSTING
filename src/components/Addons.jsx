import React, { Component } from 'react';
import './ManagerWindow.css';
import { Table } from './Table';

function Addons() {
    return (
        <div>
            <h2>Add-ons Report</h2>
            <Table columnType={'addons'} dataType={'report'} />
        </div>
    );
}

export default Addons;