// src/StaffComponents/RouteTable.jsx
import React, { useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const RouteTable = ({ routes, handleDeleteRoute }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
    const getNestedValue = (obj, key) => {
        const keys = key.split('.');
        return keys.reduce((value, k) => (value ? value[k] : null), obj);
    };
    const sortedRoutes = [...routes].sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key);
            const bValue = getNestedValue(b, sortConfig.key);
            if (aValue == null) return sortConfig.direction === 'ascending' ? 1 : -1;
            if (bValue == null) return sortConfig.direction === 'ascending' ? -1 : 1;

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
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
            <thead className="table-white">
                <tr>
                    <th scope="col" onClick={() => handleSort('id')}>
                        STT {getSortIcon('id')}
                    </th>
                    <th scope="col" onClick={() => handleSort('from.name')}>
                        Điểm Xuất Phát {getSortIcon('from.name')}
                    </th>
                    <th scope="col" onClick={() => handleSort('to.name')}>
                        Điểm Đến {getSortIcon('to.name')}
                    </th>
                    <th scope="col" onClick={() => handleSort('distance')}>
                        Khoảng Cách {getSortIcon('distance')}
                    </th>
                    <th scope="col" onClick={() => handleSort('duration')}>
                        Thời Gian Đi Ước Tính {getSortIcon('duration')}
                    </th>
                    <th scope="col">Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {sortedRoutes.map(route => (
                    <tr key={route.id} className="align-middle">
                        <td>{route.id}</td>
                        <td>{route.from.name}</td>
                        <td>{route.to.name}</td>
                        <td>{route.distance} km</td>
                        <td>{route.duration}</td>
                        <td>
                            <button className="btn btn-info btn-sm me-2" >
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
