import React, { Component } from 'react';
import './ManagerWindow.css';
import { Table } from './Table';

function AddonsReport({ header, type }) {
    return (
        <div>
            <br></br>
            <h2>{header}</h2>
            <div className='table-report'>
                <Table columnType={type} dataType={'addons-report'} />
            </div>
        </div>
    );
}

export default AddonsReport;