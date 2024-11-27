// BookingTable.jsx
import React, { useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import formatTimeFromDatabase from '../../sharedComponents/formatTimeFromDatabase';
import PaymentDialog from './PaymentDialog';
import notificationWithIcon from '../../Components/Utils/notification';
import BookingDetailDialog from './BookingDetailDialog';

const BookingTable = ({ bookings, onDelete, currentPage, size }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
    const [selectedBooking, setSelectedBooking] = useState(null); // Dòng được chọn
    const [selectedBooking1, setSelectedBooking1] = useState(null); // Dòng được chọn
    const [updatedBookings, setUpdatedBookings] = useState(bookings); // Danh sách bookings đã cập nhật
    const handleOpenDialog = (booking) => {
        setSelectedBooking1(booking);
    };

    const handleCloseDialog = () => {
        setSelectedBooking1(null);
    };

    const getNestedValue = (obj, key) => {
        const keys = key.split('.');
        return keys.reduce((value, k) => (value ? value[k] : null), obj);
    };

    const sortedBookings = [...bookings]
        .map((booking, index) => ({
            ...booking,
            virtualIndex: index + 1 + currentPage * size, // Tính STT theo vị trí mới
        }))
        .sort((a, b) => {
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
    const handleRowDoubleClick = (booking) => {
        if (booking.payment) {
            notificationWithIcon('info', 'Thông Báo', 'Vé đã được thanh toán');
        } else {
            setSelectedBooking(booking);
        }
    };


    return (
        <>
            <table className="table table-hover table-bordered">
                <thead className="table-success">
                    <tr>
                        <th scope="col" onClick={() => handleSort('virtualIndex')}>STT {getSortIcon('virtualIndex')}</th>
                        <th scope="col" onClick={() => handleSort('customerName')}>Tên Khách Hàng {getSortIcon('customerName')}</th>
                        <th scope="col" onClick={() => handleSort('phone')}>Số Điện Thoại {getSortIcon('phone')}</th>
                        <th scope="col" onClick={() => handleSort('seatNum')}>Số Ghế {getSortIcon('seatNum')}</th>
                        <th scope="col" onClick={() => handleSort('time')}>Thời Điểm Đặt {getSortIcon('time')}</th>
                        <th scope="col" onClick={() => handleSort('payment')}>Trạng Thái {getSortIcon('payment')}</th>
                        <th scope="col">Lộ Trình</th>
                        <th scope="col" onClick={() => handleSort('schedule.departure')}>Khởi Hành Lúc {getSortIcon('schedule.departure')}</th>
                        <th scope="col" onClick={() => handleSort('schedule.price')}>Giá Vé {getSortIcon('schedule.price')}</th>
                        <th scope="col">Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedBookings.map((booking, index) => (
                        <tr key={booking.bookingId} className="align-middle" style={{ cursor: 'pointer' }}
                            onDoubleClick={() => handleRowDoubleClick(booking)} // Xử lý double-click
                        >
                            <td>{booking.virtualIndex}</td>
                            <td>{booking.customerName}</td>
                            <td>{booking.phone}</td>
                            <td>{booking.seatNum}</td>
                            <td>{formatTimeFromDatabase(booking.time)}</td>
                            <td>
                                <span className={`badge bg-${booking.payment ? 'success' : 'danger'}`}>
                                    {booking.payment ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
                                </span>
                            </td>
                            <td>{`${booking?.schedule.route.from.name} - ${booking?.schedule.route.to.name}`}</td>
                            <td>{formatTimeFromDatabase(booking?.schedule.departure)}</td>
                            <td>{booking?.schedule?.price ? booking?.schedule?.price.toLocaleString() : "0"}</td>
                            <td>
                                {new Date(booking.schedule.departure) > new Date() && (
                                    <>
                                        <button className="btn btn-info btn-sm me-2" onClick={() => handleOpenDialog(booking)}>
                                            <i className="fa fa-eye"></i>
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => onDelete(booking.bookingId)}>
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </>
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Dialog thanh toán */}
            <PaymentDialog
                booking={selectedBooking}
                onClose={() => setSelectedBooking(null)}
            />
            {selectedBooking1 && (
                <BookingDetailDialog
                    booking={selectedBooking1}
                    onClose={handleCloseDialog}
                />
            )}

        </>
    );
};

export default BookingTable;
