import React, { Component } from 'react';
import './ManagerWindow.css';
import { Table } from './Table';

function Restock() {
    return (
        <div>
            <h2>Restock Report</h2>
            <Table columnType={'restock'} dataType={'report'} />
        </div>
    );
}

export default Restock;