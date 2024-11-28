import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import notificationWithIcon from "../../Components/Utils/notification";
import ApiService from "../../Components/Utils/apiService";
import { useSchedule } from "../../Context/ScheduleContext";

const AddTripDialog = ({ show, onClose }) => {
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [departureTime, setDepartureTime] = useState(new Date());
    const [estimatedArrivalTime, setEstimatedArrivalTime] = useState(new Date());
    const [price, setPrice] = useState(0);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [speed, setSpeed] = useState(60);
    const {loader, setLoader} = useSchedule();

    useEffect(() => {
        if (show) {
            setSelectedBus(null);
            setSelectedRoute(null);
            setDepartureTime(new Date());
            setEstimatedArrivalTime(new Date());
            setPrice(0);
        }
    }, [show]);

    useEffect(() => {
        fetchBuses();
        fetchRoutes();
    }, [page]);

    useEffect(() => {
        handlePriceChange();
    }, [selectedBus, selectedRoute]);

    useEffect(() => {
        handleArrivalChange();
    }, [departureTime, selectedRoute]);

    const fetchBuses = async () => {
        const response = await ApiService.get(`/api/busesLimit?page=${page}&size=${size}`);
        if (response) {
            setBuses(response);
        }
    };

    const fetchRoutes = async () => {
        const response = await ApiService.get(`/api/route-management?page=${page}&size=${size}`);
        if (response) {
            setRoutes(response);
        }
    };

    const handleScrollSelect = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
            setPage(page + 1);
        }
    };

    const handlePriceChange = () => {
        if (selectedBus && selectedRoute) {
            const busPrice = selectedBus.price;
            const routeDistance = selectedRoute.distance;
            setPrice(busPrice * routeDistance);
        }
    };

    const handleArrivalChange = () => {
        if(selectedRoute) {
            const routeDistance = selectedRoute.distance;
            const arrivalTime = new Date(departureTime);
            const [hours, minutes] = selectedRoute.duration.split(':').map(Number);
            arrivalTime.setHours(arrivalTime.getHours() + hours);
            arrivalTime.setMinutes(arrivalTime.getMinutes() + minutes);
            setEstimatedArrivalTime(arrivalTime);
        }
    };


    const handleSave = () => {
        if (!selectedBus || !selectedRoute || !departureTime) {
            notificationWithIcon('info', 'Lưu Ý', 'Vui lòng điền đầy đủ!');
            return;
        }
        saveTrip();
        onClose();
    };

    const saveTrip = async () => {
        const trip = {
            bus: selectedBus.bus,
            route: selectedRoute.route,
            departure: departureTime,
            arrival: estimatedArrivalTime,
            price: price,
        };

        const response = await ApiService.post(`/api/schedule`, trip);
        if (response) {
            notificationWithIcon('success', 'Thành Công', 'Thêm Chuyến Đi Thành Công!');
            setLoader(1);
        } else {
            notificationWithIcon('error', 'Lỗi', 'Thêm Chuyến Đi Thất Bại!');
        }
    }
    const formatDateTime = (date) => {
        if (!date) return ""; // Trả về chuỗi rỗng nếu giá trị không hợp lệ
        const isoString = date.toISOString();
        return isoString.substring(0, 16); // Lấy phần YYYY-MM-DDTHH:MM
      };

    return (
        <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1">
            <div className="modal-dialog  modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Schedule</h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            {/* Select Bus */}
                            <div className="mb-3">
                                <label htmlFor="bus" className="form-label">
                                    Chọn Xe:
                                </label>
                                <Select
                                    id="bus"
                                    options={buses?.map((bus) => ({ value: bus.id, label: bus.busnumber + " - " + bus.driver.name + " (Driver)", price: bus.category.price, bus: bus }))} // Thêm biển số xe vào option
                                    value={selectedBus}
                                    onChange={(option) => setSelectedBus(option)}
                                    placeholder="Choose a bus..."
                                    isSearchable
                                    onMenuScroll={handleScrollSelect}
                                />
                            </div>

                            {/* Select Route */}
                            <div className="mb-3">
                                <label htmlFor="route" className="form-label">
                                    Chọn Tuyến Đường:
                                </label>
                                <Select
                                    id="route"
                                    options={routes?.map((route) => ({ value: route.id, label: route.from.name + " - " + route.to.name + " - " + route.distance + " Km", distance: route.distance, route: route, duration: route.duration }))} // Thêm tên điểm đến và điểm đến vào option
                                    value={selectedRoute}
                                    onChange={(option) => setSelectedRoute(option)}
                                    placeholder="Choose a route..."
                                    isSearchable
                                    onMenuScroll={handleScrollSelect}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Giá Chuyến:
                                </label>
                                <input type="text" className="form-control" disabled value={price.toLocaleString() + ' VND'} style={{ color: 'red' }} />
                            </div>

                            {/* Departure Time */}
                            <div className="mb-3">
                                <label htmlFor="departure-time" className="form-label">
                                    Thời Gian Khởi Hành:
                                </label>
                                <input type="datetime-local" className="form-control"
                                    onChange={(e) => setDepartureTime(new Date(e.target.value))}
                                />
                            </div>

                            {/* Estimated Arrival Time */}
                            <div className="mb-3">
                                <label htmlFor="arrival-time" className="form-label">
                                    Thời Gian Dự Kiến Đến:
                                </label>
                                <input type="datetime-local" className="form-control" disabled value={formatDateTime(estimatedArrivalTime) } />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTripDialog;
