import React, { useState, useMemo } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import formatTimeFromDatabase from '../../sharedComponents/formatTimeFromDatabase';

const TripTable = ({ trips, onEdit, onDelete }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const getNestedValue = (obj, key) => {
        const keys = key.split('.');
        return keys.reduce((value, k) => (value ? value[k] : null), obj);
    };
    // Hàm xử lý sắp xếp
    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            if (prevConfig.key === key) {
                return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
            } else {
                return { key, direction: 'asc' };
            }
        });
    };

    // Sắp xếp danh sách chuyến xe dựa trên cấu hình sắp xếp
    const sortedTrips = useMemo(() => {
        const sortedData = [...trips];
        sortedData.sort((a, b) => {
            const aValue = getNestedValue(a, sortConfig.key);
            const bValue = getNestedValue(b, sortConfig.key);
            if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
            if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortedData;
    }, [trips, sortConfig]);

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    return (
        <table className="table table-hover table-bordered">
            <thead className="table-success">
                <tr>
                    <th scope="col" onClick={() => handleSort('id')}>
                        ID {getSortIcon('id')}
                    </th>
                    <th scope="col" onClick={() => handleSort('route.from.name')}>
                        Đi Từ {getSortIcon('route.from.name')}
                    </th>
                    <th scope="col" onClick={() => handleSort('route.to.name')}>
                        Đi Đến {getSortIcon('route.to.name')}
                    </th>
                    <th scope="col" onClick={() => handleSort('departure')}>
                        Khởi Hành Lúc {getSortIcon('departure')}
                    </th>
                    <th scope="col" onClick={() => handleSort('arrival')} >
                        Dự Kiến Đến{getSortIcon('arrival')}
                    </th>
                    <th scope="col">Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {sortedTrips.map(trip => (
                    <tr key={trip.id} className="align-middle">
                        <td>{trip.id}</td>
                        <td>{trip.route.from.name}</td>
                        <td>{trip.route.to.name}</td>
                        <td>{formatTimeFromDatabase(trip?.departure)}</td>
                        <td>{formatTimeFromDatabase(trip?.arrival)}</td>
                        <td>
                            <button className="btn btn-info btn-sm me-2" onClick={() => onEdit(trip.id)}>
                                <i className="fa fa-eye"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => onDelete(trip.id)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TripTable;
