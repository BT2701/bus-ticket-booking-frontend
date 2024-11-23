import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchFilterBooking from './SearchFilter';
import AddBookingDialog from './AddBookingDialog';
import BookingTable from './BookingTable';
import NotificationDialog from '../../sharedComponents/notificationDialog';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingBookingId, setEditingBookingId] = useState(null);
    const [newBooking, setNewBooking] = useState({
        customerName: '',
        email: '',
        phoneNumber: '',
        from: '',
        to: '',
        departureTime: '',
        status: 'Pending',
        seats: [],
    });
    const [seats, setSeats] = useState(["A1", "A2", "A3", "B1", "B2", "B3"]);  // Example seats list
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    useEffect(() => {
        fetchBookings();
    }, [page]);

    const fetchBookings = async () => {
        const response = await axios.get(`http://localhost:8080/api/booking-management?page=${page}&size=${size}`);
        if (response.status === 200) {
            setBookings(response.data);
            setFilteredBookings(response.data);
            setLoading(false);
        }
    };

    const handleAddBooking = () => {
        const newBookingDetails = { id: bookings.length + 1, ...newBooking, bookingTime: new Date().toLocaleString(), seatNumber: newBooking.seats.join(", ") };
        setBookings([...bookings, newBookingDetails]);
        setShowDialog(false);
        setNewBooking({
            customerName: '',
            email: '',
            phoneNumber: '',
            from: '',
            to: '',
            departureTime: '',
            status: 'Pending',
            seats: [],
        });
    };

    const handleEditBooking = (id) => {
        setIsEditing(true);
        setEditingBookingId(id);
        const bookingToEdit = bookings.find(booking => booking.id === id);
        setNewBooking(bookingToEdit); // Set the booking data to the dialog
        setShowDialog(true);
    };

    const handleSaveEdit = (updatedBooking) => {
        setBookings(bookings.map(booking => booking.id === editingBookingId ? { ...booking, ...updatedBooking } : booking));
        setShowDialog(false);
        setIsEditing(false);
        setEditingBookingId(null);
    };

    const handleDeleteBooking = (id) => {
        setBookingToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        setBookings(bookings.filter(booking => booking.id !== bookingToDelete));
        setShowDeleteConfirm(false);
        setBookingToDelete(null);
        toast.success('Xóa thành công!');
        // alert('Xóa thành công!');
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setBookingToDelete(null);
    };
    const handleFilter = (filterCriteria) => {
        const filtered = bookings.filter(booking => {
            return (
                (!filterCriteria.customerName || booking.customerName.toLowerCase().includes(filterCriteria.customerName.toLowerCase())) &&
                (!filterCriteria.phoneNumber || booking.phoneNumber.includes(filterCriteria.phoneNumber)) &&
                (!filterCriteria.bookingTime || booking.bookingTime.includes(filterCriteria.bookingTime)) &&
                (!filterCriteria.status || booking.status.toLowerCase() === filterCriteria.status.toLowerCase()) &&
                (!filterCriteria.from || booking.from.toLowerCase().includes(filterCriteria.from.toLowerCase())) &&
                (!filterCriteria.to || booking.to.toLowerCase().includes(filterCriteria.to.toLowerCase())) &&
                (!filterCriteria.departureTime || booking.departureTime.includes(filterCriteria.departureTime))
            );
        });
        setFilteredBookings(filtered);
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
        <div className="booking-schedule-management container my-5">
            <h1 className="text-uppercase fw-bold" style={{ fontSize: '1.5rem', color: '#000' }}>Đặt Vé</h1>
            <p className="text-success mb-4" style={{ fontSize: '1.1rem', fontWeight: 'normal', marginTop: '-10px' }}>Quản lý đặt vé</p>
            <SearchFilterBooking onFilter={handleFilter} />

            <button className="btn mb-4" onMouseEnter={(e) => e.target.style.backgroundColor = '#76c776'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#90EE90'} style={{ backgroundColor: '#90EE90' }} onClick={() => setShowDialog(true)}>Tạo Mới</button>
            <AddBookingDialog
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                newBooking={newBooking}
                setNewBooking={setNewBooking}
                handleAddBooking={handleAddBooking}
                seats={seats}
                handleSaveEdit={isEditing ? handleSaveEdit : handleAddBooking}
                isEditing={isEditing ? bookings.find(booking => booking.id === editingBookingId) : null}
            />
            <BookingTable bookings={filteredBookings} onEdit={handleEditBooking} onDelete={handleDeleteBooking} />
            <div>
                <button className="btn btn-primary" onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button>
                <button className="btn btn-primary" onClick={() => setPage(page + 1)} disabled={bookings.length < size}>Next</button>
            </div>
            <NotificationDialog
                message="Bạn có chắc muốn xóa?"
                isOpen={showDeleteConfirm}
                onClose={cancelDelete}
                type="warning"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default BookingManagement;
