import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddTripDialog from './AddSchedule';  // Import dialog component
import SearchFilter from './SearchSchedule'; // Import SearchFilter component
import TripTable from './ScheduleTable'; // Import TripTable component
import NotificationDialog from '../../sharedComponents/notificationDialog';

const ScheduleManagement = () => {
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);  // State for controlling dialog visibility
    const [isEditing, setIsEditing] = useState(false);
    const [editingTripId, setEditingTripId] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null); // Lưu trữ id của chuyến đi cần xóa


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
        setShowNotification(true); // Mở dialog cảnh báo
        setTripToDelete(id);
    };

    const handleConfirmDelete = () => {
        setTrips(trips.filter(trip => trip.id !== tripToDelete)); // Xóa chuyến đi
        setShowNotification(false); // Đóng dialog
    };

    const handleCancelDelete = () => {
        setShowNotification(false); // Đóng dialog nếu người dùng hủy bỏ
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
            <h1 className="text-uppercase fw-bold" style={{ fontSize: '1.5rem', color: '#000' }}>Lịch Trình</h1>
            <p className="text-success mb-4" style={{ fontSize: '1.1rem', fontWeight: 'normal', marginTop: '-10px' }}>Quản lý lịch trình</p>

            <SearchFilter onFilter={handleFilter} />

            <button className="btn mb-4" onMouseEnter={(e) => e.target.style.backgroundColor = '#76c776'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#90EE90'} style={{ backgroundColor: '#90EE90' }} onClick={() => setShowDialog(true)}>Thêm Chuyến</button>

            <AddTripDialog
                show={showDialog}
                onClose={() => setShowDialog(false)}
                onSave={isEditing ? handleSaveEdit : handleAddTrip}
                tripToEdit={isEditing ? trips.find(trip => trip.id === editingTripId) : null}
            />

            <TripTable
                trips={filteredTrips}
                onEdit={handleEditTrip}
                onDelete={handleDeleteTrip}
            />
            <NotificationDialog
                message="Bạn có chắc muốn xóa?"
                isOpen={showNotification}
                onClose={handleCancelDelete}
                type="warning"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default ScheduleManagement;
