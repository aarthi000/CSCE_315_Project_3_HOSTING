import React, { Component } from 'react';
import './ManagerWindow.css';
import { Table } from './Table';

/**
 * @function 'SalesReport' - Function to display Sales report
 * @param  {Header} header - handle to event object
 * @param  {string} type - column type
 * @return {HtmlElement} sales report in html
 */
function SalesReport({ header, type }) {
    return (
        <div>
            <br></br>
            <h2>{header}</h2>
            <div className='table-report'>
                <Table columnType={type} dataType={'sales-report'} />
            </div>
        </div>
    );
}

export default SalesReport;
