import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import { INVENTORY_COLUMNS } from './InventoryColumns';
import { RESTOCK_COLUMNS } from './RestockColumns';
import INVENTORY_DATA from './InventoryData.json';
import REPORT_DATA from './ReportData.json';

export const Table = ({columnType, dataType}) => {
    var columns;
    var data;
    switch(columnType) {
        case 'inventory':
            columns = useMemo(() => INVENTORY_COLUMNS, []);
            break;
        case 'restock':
            columns = useMemo(() => RESTOCK_COLUMNS, []);
            break;
        case 'excess':
            break;
        case 'sales':
            break;
        case 'add-ons':
            break;
    }
    switch(dataType) {
        case 'inventory':
            data = useMemo(() => INVENTORY_DATA, []);
            break;
        case 'report':
            data = useMemo(() => REPORT_DATA, []);
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