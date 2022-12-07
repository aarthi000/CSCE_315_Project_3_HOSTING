import React, { useMemo , useEffect, useState} from 'react';
import { useTable } from 'react-table';
import { INVENTORY_COLUMNS } from './InventoryColumns';
import { RESTOCK_COLUMNS } from './RestockColumns';
import { SALES_COLUMNS } from './SalesColumns';
import { EXCESS_COLUMNS } from './ExcessColumns';
import { ADDONS_COLUMNS } from './AddonsColumns';
// import INVENTORY_DATA from './InventoryData.json';
// import REPORT_DATA from './ReportData.json';

import "./Table.css";

export const Table = ({ columnType, dataType }) => {
    var columns;
    var data;
    
    const[inventory, setInventory] = useState([]);

    /**
     * @function 'getInventory' - Function to get inventory of ingredients
     * @return {void}
     */
    const getInventory = async () => {
        try{
        const response = await fetch ("https://rev-api-manager.onrender.com/inventory");
        // const response = await fetch ("http://localhost:3300/inventory");
        const jsonData = await response.json();
        setInventory(jsonData);
        }catch (err){
        console.error("Error in getInventory() in Table.jsx");
        console.error(err.message);
        }
    }



    const[restockReport, setRestockReport] = useState([]);

    /**
     * @function 'getRestockReport' - Function to get Restock Report
     * @return {void}
     */
    const getRestockReport = async () => {
        try{
        const response = await fetch ("https://rev-api-manager.onrender.com/restock");
        // const response = await fetch ("http://localhost:3300/restock");
        const jsonData = await response.json();
        setRestockReport(jsonData);
        console.log(restockReport); 
        }catch (err){
        console.error("Error in setRestockReport() in Table.jsx");
        console.error(err.message);
        }
    }

    const[salesReport, setSalesReport] = useState([]);

    /**
     * @function 'getSalesReport' - Function to get Sales Report
     * @return {void}
     */
    const getSalesReport = async () => {
        try{
            const response = await fetch ("https://rev-api-manager.onrender.com/sales");
            // const response = await fetch ("http://localhost:3300/sales");
            const jsonData = await response.json();
            setSalesReport(jsonData);
        }catch (err){
            console.error("Error in getSalesReport() in Table.jsx");
            console.error(err.message);
        }
    }

    const[addonsReport, setAddonsReport] = useState([]);

    /**
     * @function 'getAddonsReport' - Function to get Addons  Report
     * @return {void}
     */
    const getAddonsReport = async () => {
        try{
            const response = await fetch ("https://rev-api-manager.onrender.com/addonsreport");
            // const response = await fetch ("http://localhost:3300/addonsreport");
            const jsonData = await response.json();
            setAddonsReport(jsonData);
        }catch (err){
            console.error("Error in getAddonsReport() in Table.jsx");
            console.error(err.message);
        }
    }
    
    const[excessReport, setExcessReport] = useState([]);

    /**
     * @function 'getExcessReport' - Function to get Excess Report
     * @return {void}
     */
    const getExcessReport = async () => {
        try{
            const response = await fetch ("https://rev-api-manager.onrender.com/excess");
            // const response = await fetch ("http://localhost:3300/excess");
            const jsonData = await response.json();
            setExcessReport(jsonData);
        }catch (err){
            console.error("Error in getExcessReport() in Table.jsx");
            console.error(err.message);
        }
    }


    useEffect(()=> {
        getInventory();
        getRestockReport();
        getSalesReport();
        getAddonsReport();
        getExcessReport();
    }, []);

    switch(columnType) {
        case 'inventory':
            columns = useMemo(() => INVENTORY_COLUMNS, []);
            break;
        case 'restock':
            columns = useMemo(() => RESTOCK_COLUMNS, []);
            break;
        case 'sales':
            columns = useMemo(() => SALES_COLUMNS, []);
            break;
        case 'excess':
            columns = useMemo(() => EXCESS_COLUMNS, []);
            break;
        case 'addons':
            columns = useMemo(() => ADDONS_COLUMNS, []);
            break;
    }
    switch(dataType) {
        case 'inventory':
            data = inventory;
            break;
        case 'report':
            data = useMemo(() => REPORT_DATA, []);
            break;
        case 'restock-report':
            data = restockReport;
            break;
        case 'sales-report':
            data = salesReport;
            break;
        case 'addons-report':
            data = addonsReport;
            break;
        case 'excess-report':
            data = excessReport;
            break;
    }
    
    const tableInstance = useTable({
        columns,
        data
    });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = tableInstance;

    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
};
