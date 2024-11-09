import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddTripDialog from './AddSchedule';  // Import dialog component
import SearchFilter from './SearchFilter'; // Import SearchFilter component

const ScheduleManagement = () => {
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);  // State for controlling dialog visibility
    const [isEditing, setIsEditing] = useState(false);
    const [editingTripId, setEditingTripId] = useState(null);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        const fetchedTrips = [
            { id: 1, from: 'Hà Nội', to: 'Hải Phòng', departureTime: '08:00 AM', status: 'Pending' },
            { id: 2, from: 'Hồ Chí Minh', to: 'Vũng Tàu', departureTime: '09:30 AM', status: 'Confirmed' },
            { id: 3, from: 'Đà Nẵng', to: 'Huế', departureTime: '10:00 AM', status: 'Pending' },
        ];
        setTrips(fetchedTrips);
        setFilteredTrips(fetchedTrips);
        setLoading(false);
    };

    const handleAddTrip = (newTrip) => {
        setTrips([...trips, { id: trips.length + 1, ...newTrip }]);
        setShowDialog(false);  // Close dialog after saving
    };

    const handleEditTrip = (id) => {
        const tripToEdit = trips.find(trip => trip.id === id);
        setIsEditing(true);
        setEditingTripId(id);
        setShowDialog(true);  // Open dialog for editing
    };

    const handleSaveEdit = (updatedTrip) => {
        setTrips(trips.map(trip => trip.id === editingTripId ? { ...trip, ...updatedTrip } : trip));
        setShowDialog(false);  // Close dialog after saving
        setIsEditing(false);
        setEditingTripId(null);
    };

    const handleDeleteTrip = (id) => {
        setTrips(trips.filter(trip => trip.id !== id));
    };

    const handleFilter = (filterCriteria) => {
        const { from, to, departureTime, status } = filterCriteria;
        const filtered = trips.filter(trip => {
            return (
                (!from || trip.from.toLowerCase().includes(from.toLowerCase())) &&
                (!to || trip.to.toLowerCase().includes(to.toLowerCase())) &&
                (!departureTime || trip.departureTime.includes(departureTime)) &&
                (!status || trip.status.toLowerCase() === status.toLowerCase())
            );
        });
        setFilteredTrips(filtered);
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
            <h1 className="text-uppercase fw-bold" style={{ fontSize: '2rem', color: '#000' }}>Lịch Trình</h1>
            <p className="text-success mb-4" style={{ fontSize: '1.2rem', fontWeight: 'normal', marginTop: '-10px' }}>Quản lý lịch trình</p>

            <SearchFilter onFilter={handleFilter} />

            <button className="btn btn-primary mb-4" onClick={() => setShowDialog(true)}>Add New Trip</button>

            <AddTripDialog
                show={showDialog}
                onClose={() => setShowDialog(false)}
                onSave={isEditing ? handleSaveEdit : handleAddTrip}
                tripToEdit={isEditing ? trips.find(trip => trip.id === editingTripId) : null}
            />

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
                    {filteredTrips.map(trip => (
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
                                <button className="btn btn-info btn-sm me-2" onClick={() => handleEditTrip(trip.id)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTrip(trip.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScheduleManagement;
