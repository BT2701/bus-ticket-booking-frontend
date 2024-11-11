import React, { useState, useMemo } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const TripTable = ({ trips, onEdit, onDelete }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

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
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
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
                    <th scope="col" onClick={() => handleSort('from')}>
                        Đi Từ {getSortIcon('from')}
                    </th>
                    <th scope="col" onClick={() => handleSort('to')}>
                        Đi Đến {getSortIcon('to')}
                    </th>
                    <th scope="col" onClick={() => handleSort('departureTime')}>
                        Khởi Hành Lúc {getSortIcon('departureTime')}
                    </th>
                    <th scope="col">Trạng Thái</th>
                    <th scope="col">Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {sortedTrips.map(trip => (
                    <tr key={trip.id} className="align-middle">
                        <td>{trip.id}</td>
                        <td>{trip.from}</td>
                        <td>{trip.to}</td>
                        <td>{trip.departureTime}</td>
                        <td>
                            <span className={`badge bg-${trip.status === 'Confirmed' ? 'success' : trip.status === 'Cancelled' ? 'danger' : 'secondary'}`}>
                                {trip.status}
                            </span>
                        </td>
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
