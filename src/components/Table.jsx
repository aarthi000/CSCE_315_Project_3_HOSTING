import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import MOCK_DATA from './MOCK_DATA.json';
import { COLUMNS } from './Columns';

export const Table = () => {
    const columns = useMemo(() => COLUMNS, []);
   /* 
    const requestURL = "http://192.168.1.71:3300/inventory";
    const request = new Request(requestURL);

    const response = await fetch(request, {
		method: 'GET', 
                headers: { 
                        'Content-Type': 'application/json',
                },
                mode: 'cors', 
            });
    const jsondata = await response.json();
    //const data = useMemo( () => JSON.stringify(jsondata), []);
   */ 
    const data = useMemo( () => MOCK_DATA, []);
    
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
