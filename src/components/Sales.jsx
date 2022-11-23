import React, { Component } from 'react';
import './ManagerWindow.css';
import { Table } from './Table';

function Sales() {
    return (
        <div>
            <h2>Sales Report</h2>
            <Table columnType={'sales'} dataType={'report'} />
        </div>
    );
}

export default Sales;