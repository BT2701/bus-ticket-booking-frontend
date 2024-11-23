// BookingTable.jsx
import React, { useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import formatTimeFromDatabase from '../../sharedComponents/formatTimeFromDatabase';

const BookingTable = ({ bookings, onEdit, onDelete }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

    const sortedBookings = [...bookings].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
        }));
    };

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    return (
        <table className="table table-hover table-bordered">
            <thead className="table-success">
                <tr>
                    <th scope="col" onClick={() => handleSort('id')}>STT {getSortIcon('id')}</th>
                    <th scope="col" onClick={() => handleSort('customerName')}>Tên Khách Hàng {getSortIcon('customerName')}</th>
                    <th scope="col" onClick={() => handleSort('phoneNumber')}>Số Điện Thoại {getSortIcon('phoneNumber')}</th>
                    <th scope="col" onClick={() => handleSort('seatNumber')}>Số Ghế {getSortIcon('seatNumber')}</th>
                    <th scope="col" onClick={() => handleSort('bookingTime')}>Thời Điểm Đặt {getSortIcon('bookingTime')}</th>
                    <th scope="col" onClick={() => handleSort('status')}>Trạng Thái {getSortIcon('status')}</th>
                    <th scope="col">Lộ Trình</th>
                    <th scope="col" onClick={() => handleSort('departureTime')}>Khởi Hành Lúc {getSortIcon('departureTime')}</th>
                    <th scope="col" onClick={() => handleSort('price')}>Giá Vé {getSortIcon('price')}</th>
                    <th scope="col">Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {sortedBookings.map((booking, index) => (
                    <tr key={booking.id} className="align-middle">
                        <td>{index + 1}</td>
                        <td>{booking.customerName}</td>
                        <td>{booking.phone}</td>
                        <td>{booking.seatNum}</td>
                        <td>{formatTimeFromDatabase(booking.time)}</td>
                        <td>
                            <span className={`badge bg-${booking.payment ? 'success' : 'danger'}`}>
                                {booking.payment ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
                            </span>
                        </td>
                        <td>{`${booking.from} - ${booking.to}`}</td>
                        <td>{formatTimeFromDatabase(booking.departure)}</td>
                        <td>{booking.cost ? booking.cost.toLocaleString() : "0"}</td>
                        <td>
                            <button className="btn btn-info btn-sm me-2" onClick={() => onEdit(booking.id)}>
                                <i className="fa fa-eye"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => onDelete(booking.id)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BookingTable;
