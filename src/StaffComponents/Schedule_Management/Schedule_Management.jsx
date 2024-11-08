import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ScheduleManagement = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        // Simulate fetching trip schedules
        const fetchedTrips = [
            { id: 1, from: 'Hà Nội', to: 'Hải Phòng', departureTime: '08:00 AM', status: 'Pending' },
            { id: 2, from: 'Hồ Chí Minh', to: 'Vũng Tàu', departureTime: '09:30 AM', status: 'Confirmed' },
            { id: 3, from: 'Đà Nẵng', to: 'Huế', departureTime: '10:00 AM', status: 'Pending' },
        ];
        setTrips(fetchedTrips);
        setLoading(false);
    };

    const confirmTrip = (id) => {
        setTrips(trips.map(trip => trip.id === id ? { ...trip, status: 'Confirmed' } : trip));
    };

    const cancelTrip = (id) => {
        setTrips(trips.map(trip => trip.id === id ? { ...trip, status: 'Cancelled' } : trip));
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
        <div className="trip-schedule-management container my-5">
            <h1 className="text-center mb-4">Trip Schedule Management</h1>
            <table className="table table-hover table-bordered">
                <thead className="table-success">
                    <tr>
                        <th scope="col">Trip ID</th>
                        <th scope="col">From</th>
                        <th scope="col">To</th>
                        <th scope="col">Departure Time</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.map(trip => (
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
                                {trip.status === 'Pending' && (
                                    <button className="btn btn-success btn-sm me-2" onClick={() => confirmTrip(trip.id)}>
                                        Confirm
                                    </button>
                                )}
                                {trip.status !== 'Cancelled' && (
                                    <button className="btn btn-danger btn-sm" onClick={() => cancelTrip(trip.id)}>
                                        Cancel
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScheduleManagement;
