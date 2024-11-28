import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddTripDialog from './AddSchedule';  // Import dialog component
import SearchFilter from './SearchSchedule'; // Import SearchFilter component
import TripTable from './ScheduleTable'; // Import TripTable component
import NotificationDialog from '../../sharedComponents/notificationDialog';
import Pagination from '../../sharedComponents/Pagination';
import ApiService from '../../Components/Utils/apiService';
import { useSchedule } from '../../Context/ScheduleContext';
import notificationWithIcon from '../../Components/Utils/notification';

const ScheduleManagement = () => {
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);  // State for controlling dialog visibility
    const [showNotification, setShowNotification] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null); // Lưu trữ id của chuyến đi cần xóa
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const {loader, setLoader} = useSchedule();

    useEffect(() => {
        fetchTotal();
        fetchTrips();
        setLoader(0);
    }, [page, loader]);

    const fetchTotal = async () => {
        const total = await ApiService.get(`/api/schedule/total`);
        if (total) {
            setTotalItems(total);
        }
    };

    const fetchTrips = async () => {
        const response = await ApiService.get(`/api/schedule-management?page=${page}&size=${size}`);
        if (response) {
            setTrips(response);
            setFilteredTrips(response);
            setLoading(false);
        }
    };


    const handleDeleteTrip = (id) => {
        setShowNotification(true); // Mở dialog cảnh báo
        setTripToDelete(id);
    };

    const handleConfirmDelete = () => {
        ApiService.delete(`/api/schedule/${tripToDelete}`)
            .then(() => {
                setShowNotification(false); // Đóng dialog
                notificationWithIcon('success', 'Thành công', 'Xóa chuyến đi thành công');
                setLoader(1);
            })
            .catch(() => {
                notificationWithIcon('error', 'Lỗi', 'Xóa chuyến đi thất bại');
            })
            .finally(() => {
                setShowNotification(false); // Đóng dialog
                setTripToDelete(null);
            }
            );
    };

    const handleCancelDelete = () => {
        setShowNotification(false); // Đóng dialog nếu người dùng hủy bỏ
    };

    const handleFilter = (filterCriteria) => {
        const { from, to, departureTime, arrival } = filterCriteria;
        const filtered = trips.filter(trip => {
            return (
                (!from || trip.route.from.name.toLowerCase().includes(from.toLowerCase())) &&
                (!to || trip.route.to.name.toLowerCase().includes(to.toLowerCase())) &&
                (!departureTime || new Date(trip.departure).toLocaleString().includes(departureTime)) &&
                (!arrival || trip.arrival.includes(arrival))
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
            />

            <TripTable
                trips={filteredTrips}
                onDelete={handleDeleteTrip}
            />
            <Pagination
                page={page}
                setPage={setPage}
                totalItems={totalItems}
                itemsPerPage={size}
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
