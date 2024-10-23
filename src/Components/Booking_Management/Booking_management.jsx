import React, { useState, useEffect } from 'react';
import './Booking.css';
const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch bookings from an API or database
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        // Simulate fetching data
        const fetchedBookings = [
            { id: 1, user: 'User1', status: 'Pending' },
            { id: 2, user: 'User2', status: 'Confirmed' },
            // Add more bookings as needed
        ];
        setBookings(fetchedBookings);
        setLoading(false);
    };

    const confirmBooking = (id) => {
        // Logic to confirm booking
        setBookings(bookings.map(booking => booking.id === id ? { ...booking, status: 'Confirmed' } : booking));
    };

    const cancelBooking = (id) => {
        // Logic to cancel booking
        setBookings(bookings.map(booking => booking.id === id ? { ...booking, status: 'Cancelled' } : booking));
    };

    const handleRefund = (id) => {
        // Logic to handle refund
        alert(`Refund processed for booking ID: ${id}`);
    };

    const handleComplaint = (id) => {
        // Logic to handle complaint
        alert(`Complaint handled for booking ID: ${id}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="booking-management container">
            <h1 className="my-4">Booking Management</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.user}</td>
                            <td>{booking.status}</td>
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