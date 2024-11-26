import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchFilterBooking from './SearchFilter';
import AddBookingDialog from './AddBookingDialog';
import BookingTable from './BookingTable';
import NotificationDialog from '../../sharedComponents/notificationDialog';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Pagination from '../../sharedComponents/Pagination';
import { useBooking } from '../../Context/BookingContex';
import { set } from 'date-fns';
import notificationWithIcon from '../../Components/Utils/notification';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { loader, setLoader } = useBooking();
    const [bookingToDelete, setBookingToDelete] = useState("");

    useEffect(() => {
        fetchTotal();
        fetchBookings();
        setLoader(0);
    }, [page,loader]);
    const fetchTotal = async () => {
        const total = await axios.get(`http://localhost:8080/api/booking/total`);
        setTotalItems(total.data);
    }
    const fetchBookings = async () => {
        const response = await axios.get(`http://localhost:8080/api/booking-management?page=${page}&size=${size}`);
        if (response.status === 200) {
            setBookings(response.data);
            setFilteredBookings(response.data);
            setLoading(false);
        }
        else if (response.status === 404) {
            setLoading(true);
        }
    };
    

    const handleDeleteBooking = (id) => {
        setBookingToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        axios.delete(`http://localhost:8080/api/booking/${bookingToDelete}`)
            .then(() => {
                setLoader(1);
                notificationWithIcon ('success', 'Success', 'Xóa đặt vé thành công');
            })
            .catch((error) => {
                console.log(error);
                notificationWithIcon ('error', 'Error', 'Xóa đặt vé thất bại');
            });
        setShowDeleteConfirm(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };
    const handleFilter = (filterCriteria) => {
        const filtered = bookings.filter(booking => {
            return (
                (!filterCriteria.customerName || booking.customerName.toLowerCase().includes(filterCriteria.customerName.toLowerCase())) &&
                (!filterCriteria.phoneNumber || booking.phone.includes(filterCriteria.phoneNumber)) &&
                (!filterCriteria.bookingTime || new Date(booking.time).toLocaleString().includes(filterCriteria.bookingTime)) &&
                (!filterCriteria.status || (booking.payment !== null ? "1" : "0") === filterCriteria.status) &&
                (!filterCriteria.from || booking.schedule.route.from.name.toLowerCase().includes(filterCriteria.from.toLowerCase())) &&
                (!filterCriteria.to || booking.schedule.route.to.name.toLowerCase().includes(filterCriteria.to.toLowerCase())) &&
                (!filterCriteria.departureTime || new Date(booking.schedule.departure).toLocaleString().includes(filterCriteria.departureTime))
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
            {showDialog && (
                <AddBookingDialog
                    onClose={() => setShowDialog(false)} // Đóng dialog
                />
            )}
            <div>
                <span style={{ color: 'gray', fontStyle: 'italic' }}>*Nhấn đúp chuột để hoàn tất thanh toán</span>
            </div>
            <BookingTable bookings={filteredBookings}  onDelete={handleDeleteBooking} currentPage={page} size={size} />
            <Pagination
                page={page}
                setPage={setPage}
                totalItems={totalItems}
                itemsPerPage={size}
            />
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
