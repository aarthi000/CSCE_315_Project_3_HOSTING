import React, { Component } from 'react';
import './ManagerWindow.css';
import { Table } from './Table';

function Report({ header, type }) {
    return (
        <div>
            <br></br>
            <h2>{header}</h2>
            <div className='table-report'>
                <Table columnType={type} dataType={'report'} />
            </div>
        </div>
    );
}

export default Report;