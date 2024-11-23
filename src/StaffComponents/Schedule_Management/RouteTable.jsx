// src/StaffComponents/RouteTable.jsx
import React, { useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const RouteTable = ({ routes, handleEditRoute, handleDeleteRoute }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

    const sortedRoutes = [...routes].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <FaSort />;
        }
        if (sortConfig.direction === 'ascending') {
            return <FaSortUp />;
        }
        return <FaSortDown />;
    };

    return (
        <table className="table table-hover table-bordered">
            <thead className="table-success">
                <tr>
                    <th scope="col" onClick={() => handleSort('id')}>
                        STT {getSortIcon('id')}
                    </th>
                    <th scope="col" onClick={() => handleSort('startPoint')}>
                        Điểm Xuất Phát {getSortIcon('startPoint')}
                    </th>
                    <th scope="col" onClick={() => handleSort('endPoint')}>
                        Điểm Đến {getSortIcon('endPoint')}
                    </th>
                    <th scope="col" onClick={() => handleSort('distance')}>
                        Khoảng Cách {getSortIcon('distance')}
                    </th>
                    <th scope="col" onClick={() => handleSort('estimatedTime')}>
                        Thời Gian Đi Ước Tính {getSortIcon('estimatedTime')}
                    </th>
                    <th scope="col">Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {sortedRoutes.map(route => (
                    <tr key={route.id} className="align-middle">
                        <td>{route.id}</td>
                        <td>{route.startPoint}</td>
                        <td>{route.endPoint}</td>
                        <td>{route.distance} km</td>
                        <td>{route.estimatedTime}</td>
                        <td>
                            <button className="btn btn-info btn-sm me-2" onClick={() => handleEditRoute(route.id)}>
                            <i className="fa fa-eye"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRoute(route.id)}>
                            <i className="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default RouteTable;
