import React, { useState, useEffect } from 'react';
import './Booking.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const fetchedBookings = [
            { id: 1, user: 'User1', status: 'Pending' },
            { id: 2, user: 'User2', status: 'Confirmed' },
        ];
        setBookings(fetchedBookings);
        setLoading(false);
    };

    const confirmBooking = (id) => {
        setBookings(bookings.map(booking => booking.id === id ? { ...booking, status: 'Confirmed' } : booking));
    };

    const cancelBooking = (id) => {
        setBookings(bookings.map(booking => booking.id === id ? { ...booking, status: 'Cancelled' } : booking));
    };

    const handleRefund = (id) => {
        alert(`Refund processed for booking ID: ${id}`);
    };

    const handleComplaint = (id) => {
        alert(`Complaint handled for booking ID: ${id}`);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-management container my-5">
            <h1 className="text-center mb-4">Booking Management</h1>
            <table className="table table-hover table-bordered">
                <thead className="table-primary">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">User</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking.id} className="align-middle">
                            <td>{booking.id}</td>
                            <td>{booking.user}</td>
                            <td>
                                <span className={`badge bg-${booking.status === 'Confirmed' ? 'success' : booking.status === 'Cancelled' ? 'danger' : 'secondary'}`}>
                                    {booking.status}
                                </span>
                            </td>
                            <td>
                                {booking.status === 'Pending' && (
                                    <button className="btn btn-success btn-sm me-2" onClick={() => confirmBooking(booking.id)}>
                                        Confirm
                                    </button>
                                )}
                                {booking.status !== 'Cancelled' && (
                                    <button className="btn btn-danger btn-sm me-2" onClick={() => cancelBooking(booking.id)}>
                                        Cancel
                                    </button>
                                )}
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleRefund(booking.id)}>
                                    Refund
                                </button>
                                <button className="btn btn-info btn-sm" onClick={() => handleComplaint(booking.id)}>
                                    Complaint
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingManagement;
