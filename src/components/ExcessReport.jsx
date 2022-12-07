import React, { Component } from 'react';
import './ManagerWindow.css';
import { Table } from './Table';

/**
 * @function 'ExcessReport' - Function to display excess report
 * @param  {Header} header - handle to event object
 * @param  {string} type - column type
 * @return {HtmlElement} excess report in html
 */
function ExcessReport({ header, type }) {
    return (
        <div>
            <br></br>
            <h2>{header}</h2>
            <div className='table-report'>
                <Table columnType={type} dataType={'excess-report'} />
            </div>
        </div>
    );
}

export default ExcessReport;
