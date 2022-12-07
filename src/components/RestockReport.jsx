import React, { Component } from 'react';
import './ManagerWindow.css';
import { Table } from './Table';

/**
 * @function 'RestockReport' - Function to display Restock report
 * @param  {Header} header - handle to event object
 * @param  {string} type - column type
 * @return {HtmlElement} Restock report in html
 */
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
