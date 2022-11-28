import React, { Component } from 'react';
import './ManagerWindow.css';
import { Table } from './Table';

function Excess() {
    return (
        <div>
            <h2>Excess Report</h2>
            <Table columnType={'excess'} dataType={'report'} />
        </div>
    );
}

export default Excess;