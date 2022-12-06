import React, { Component } from 'react';
import './ManagerWindow.css';
import { Table } from './Table';

function RestockReport({ header, type }) {
    return (
        <div>
            <br></br>
            <h2>{header}</h2>
            <div className='table-report'>
                <Table columnType={type} dataType={'restock-report'} />
            </div>
        </div>
    );
}

export default RestockReport;